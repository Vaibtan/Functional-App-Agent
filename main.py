import asyncio
import os

import uvicorn
from fastapi import FastAPI
from nicegui import ui
from pydantic import BaseModel
from starlette.staticfiles import StaticFiles

from graph import agent

app = FastAPI()
app.mount("/static", StaticFiles(directory = "static"), name = "static")

PROJECTS = {}

class ProjectPrompt(BaseModel):
    prompt: str

async def process_prompt(user_id: str, prompt: str):
    try:
        result = await asyncio.to_thread(agent.invoke, \
            { "user_prompt": prompt }, { "recursion_limit": 100 })
        PROJECTS[user_id] = { "status": "completed", "plan": \
            result.get("plan", {}), "output_dir": "generated_project" }
    except Exception as e: PROJECTS[user_id] = {"status": "error", "message": str(e)}

@app.post("/generate")
async def generate_project(prompt: ProjectPrompt):
    user_id = os.urandom(16).hex()
    PROJECTS[user_id] = {"status": "processing"}
    asyncio.create_task(process_prompt(user_id, prompt.prompt))
    return {"id": user_id}

@app.get("/status/{user_id}")
async def get_status(user_id: str):
    return PROJECTS.get(user_id, {"status": "not found"})

@app.get("/files/{user_id}")
async def list_files(user_id: str):
    project = PROJECTS.get(user_id)
    if not project or project["status"] != "completed":
        return {"error": "Project not available"}
    dir_path = project["output_dir"]
    if not os.path.exists(dir_path):
        return {"files": []}
    files = [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
    return {"files": files}

@app.get("/download/{user_id}/{filename}")
async def download_file(user_id: str, filename: str):
    project = PROJECTS.get(user_id)
    if not project or project["status"] != "completed":
        return {"error": "Project not available"}
    file_path = os.path.join(project["output_dir"], filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    with open(file_path, "r", encoding = "utf-8") as f:
        content = f.read()
    return {"content": content}

ui.run_with(app)

@ui.page('/')
def main_ui():
    with ui.column().classes('max-w-2xl mx-auto p-6'):
        ui.image('/static/logo.png').classes('w-32 h-32 mx-auto my-4').on('error', lambda: None)  # ignore if logo missing
        ui.label('Functional App Builder - Natural Language to MVP in seconds!').classes('text-2xl font-bold text-center mb-4')
        
        prompt_input = ui.textarea(label='Describe your project', placeholder='e.g., "Build a todo app with HTML, CSS, JS"').classes('w-full')
        status_label = ui.label().classes('mt-2')
        progress_bar = ui.linear_progress(value=0).classes('w-full mt-2').props('instant-feedback')
        file_container = ui.column().classes('mt-4 gap-2')

        async def handle_generate():
            prompt_text = prompt_input.value
            if not prompt_text.strip():
                status_label.text = "❌ Please enter a prompt."
                return
            progress_bar.value = 0.3
            status_label.text = "⏳ Planning your project..."
            file_container.clear()
            # Call /generate endpoint
            response = await generate_project(ProjectPrompt(prompt=prompt_text))
            user_id = response["id"]
            while True:
                await asyncio.sleep(2)
                status_resp = await get_status(user_id)
                current_status = status_resp.get("status")
                if current_status == "completed":
                    progress_bar.value = 1.0
                    status_label.text = "✅ Project Generated Successfully!"
                    # List files
                    files_resp = await list_files(user_id)
                    file_list = files_resp.get("files", [])
                    if file_list:
                        with file_container:
                            ui.label("📁 Generated Files:").classes('font-bold mt-4')
                            for filename in file_list:
                                async def download_file_callback(fname = filename):
                                    file_resp = await download_file(user_id, fname)
                                    content = file_resp.get("content", "")
                                    ui.download(media = content, filename = fname)
                                ui.button(f'📄 {filename}', on_click=download_file_callback).classes('w-full justify-between')
                    else: status_label.text += " (No files generated)"
                    break
                elif current_status == "error":
                    progress_bar.value = 0.0
                    error_msg = status_resp.get("message", "Unknown error")
                    status_label.text = f"❌ Error: {error_msg}"
                    break
                elif current_status == "processing":
                    progress_bar.value = 0.6
                    status_label.text = "🛠️ Coding your project..."
        ui.button('🚀 Generate Project', on_click = handle_generate).classes('mt-4')

if __name__ == "__main__": uvicorn.run(app, host="127.0.0.1", port = 8000)