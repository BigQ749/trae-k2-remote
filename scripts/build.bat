@echo off
setlocal
set "IDF_PATH=D:\Espressif\frameworks\esp-idf-v5.5.3"
set "IDF_TOOLS_PATH=D:\Espressif\idf-tools"
set "IDF_COMPONENT_STORAGE_URL=https://components-file.espressif.cn"
set "IDF_PY=%IDF_TOOLS_PATH%\python_env\idf5.5_py3.11_env\Scripts"
set "PATH=%IDF_PY%;%IDF_TOOLS_PATH%\tools\cmake\3.30.2\bin;%IDF_TOOLS_PATH%\tools\ninja\1.12.1;%PATH%"
if not exist "%IDF_PATH%\tools\idf.py" (
  echo ESP-IDF 5.5.3 not found at %IDF_PATH%
  echo Install it, or run: idf.py build   from firmware\ai-passport after export.bat
  exit /b 1
)
cd /d "%~dp0..\firmware\ai-passport"
"%IDF_PY%\python.exe" "%IDF_PATH%\tools\idf.py" build
exit /b %ERRORLEVEL%
