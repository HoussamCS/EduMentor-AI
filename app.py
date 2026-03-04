from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
import os
import warnings

# Suppress Pydantic v1 warnings on Python 3.14
warnings.filterwarnings("ignore", category=UserWarning, message=".*Pydantic V1.*")

from src.routes.api import api_bp


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder=os.path.join(os.path.dirname(__file__), "static"),
        static_url_path="/static",
        template_folder=os.path.join(os.path.dirname(__file__), "templates")
    )
    CORS(app)

    app.register_blueprint(api_bp, url_prefix="/api")

    # Serve React frontend if built, otherwise fallback to Jinja template
    @app.route("/")
    def index():
        react_build = os.path.join(os.path.dirname(__file__), "frontend", "build", "index.html")
        if os.path.exists(react_build):
            return send_from_directory(os.path.join(os.path.dirname(__file__), "frontend", "build"), "index.html")
        # Fallback to old template if React build doesn't exist
        return render_template("index.html")

    # Route for static assets from React build (if available)
    @app.route("/<path:path>")
    def serve_react(path):
        react_build = os.path.join(os.path.dirname(__file__), "frontend", "build")
        file_path = os.path.join(react_build, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return send_from_directory(react_build, path)
        # If not found in React build, return index for client-side routing
        # (but only if React build exists)
        if os.path.exists(react_build):
            return send_from_directory(react_build, "index.html")
        # Otherwise return 404
        return render_template("index.html"), 404

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
