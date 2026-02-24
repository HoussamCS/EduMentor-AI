async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

function extractSection(text, sectionName, nextSections) {
  const escapedSection = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedNext = nextSections
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:\\*\\*)?${escapedSection}:(?:\\*\\*)?\\s*([\\s\\S]*?)(?=(?:\\n\\s*(?:\\*\\*)?(?:${escapedNext}):(?:\\*\\*)?)|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function normalizeExerciseText(text) {
  return (text || "")
    .replace(/\r\n/g, "\n")
    .replace(/^\s*\*\*(Problem|Example Input|Expected Output|Hints|Solution|Example Usage):\*\*\s*$/gim, "$1:")
    .trim();
}

function resetExerciseDetailsVisibility() {
  const details = document.getElementById("exerciseDetails");
  const toggleBtn = document.getElementById("toggleExerciseDetailsBtn");
  details.classList.add("d-none");
  toggleBtn.textContent = "Show Hints / Solution / Example Usage";
}

document.getElementById("toggleExerciseDetailsBtn").addEventListener("click", () => {
  const details = document.getElementById("exerciseDetails");
  const toggleBtn = document.getElementById("toggleExerciseDetailsBtn");
  const isHidden = details.classList.contains("d-none");

  if (isHidden) {
    details.classList.remove("d-none");
    toggleBtn.textContent = "Hide Hints / Solution / Example Usage";
  } else {
    details.classList.add("d-none");
    toggleBtn.textContent = "Show Hints / Solution / Example Usage";
  }
});

document.getElementById("chatBtn").addEventListener("click", async () => {
  const question = document.getElementById("chatQuestion").value.trim();
  if (!question) return;

  const result = await postJson("/api/chat", { question });
  document.getElementById("chatAnswer").textContent = result.answer || result.error || "No response";

  const list = document.getElementById("chatSources");
  list.innerHTML = "";
  (result.sources || []).forEach((source) => {
    const li = document.createElement("li");
    li.textContent = source;
    list.appendChild(li);
  });
});

document.getElementById("exerciseBtn").addEventListener("click", async () => {
  const topic = document.getElementById("exerciseTopic").value;
  const difficulty = document.getElementById("exerciseDifficulty").value;

  const result = await postJson("/api/exercise", { topic, difficulty });
  const text = normalizeExerciseText(result.exercise || result.error || "No response");

  const sectionOrder = [
    "Problem",
    "Example Input",
    "Expected Output",
    "Hints",
    "Solution",
    "Example Usage",
  ];

  const problem = extractSection(text, "Problem", sectionOrder.filter((s) => s !== "Problem"));
  const exampleInput = extractSection(text, "Example Input", sectionOrder.filter((s) => s !== "Example Input"));
  const expectedOutput = extractSection(text, "Expected Output", sectionOrder.filter((s) => s !== "Expected Output"));
  const hints = extractSection(text, "Hints", sectionOrder.filter((s) => s !== "Hints"));
  const solution = extractSection(text, "Solution", sectionOrder.filter((s) => s !== "Solution"));
  const exampleUsage = extractSection(text, "Example Usage", sectionOrder.filter((s) => s !== "Example Usage"));

  document.getElementById("exerciseProblem").textContent = problem || text;
  document.getElementById("exerciseExampleInput").textContent = exampleInput || "No example input provided.";
  document.getElementById("exerciseExpectedOutput").textContent = expectedOutput || "No expected output provided.";
  document.getElementById("exerciseHints").textContent = hints || "No hints provided.";
  document.getElementById("exerciseSolution").textContent = solution || "No solution provided.";
  document.getElementById("exerciseExampleUsage").textContent = exampleUsage || "No example usage provided.";

  resetExerciseDetailsVisibility();
});

document.getElementById("gradeBtn").addEventListener("click", async () => {
  const question = document.getElementById("gradeQuestion").value.trim();
  const expected_answer = document.getElementById("gradeExpected").value.trim();
  const student_answer = document.getElementById("gradeStudent").value.trim();

  const result = await postJson("/api/grade-quiz", {
    question,
    expected_answer,
    student_answer,
  });

  document.getElementById("gradeResult").textContent = result.feedback || result.error || "No response";
});

document.getElementById("riskBtn").addEventListener("click", async () => {
  const raw = document.getElementById("riskJson").value;
  let payload = {};

  try {
    payload = JSON.parse(raw);
  } catch {
    document.getElementById("riskResult").textContent = "Invalid JSON format.";
    return;
  }

  const result = await postJson("/api/risk", payload);
  document.getElementById("riskResult").textContent = JSON.stringify(result, null, 2);
});
