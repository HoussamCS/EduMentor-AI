async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

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
  document.getElementById("exerciseResult").textContent = result.exercise || result.error || "No response";
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
