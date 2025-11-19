import subprocess
import sys

REQUIRED_PACKAGES = [
    "fastapi",
    "uvicorn[standard]",
    "sqlalchemy",
    "pydantic[email]",
    "email-validator",
    "groq",
    "python-multipart"
]

def install(package: str):
    try:
        print(f"\n📦 Instalando: {package}")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✔ Instalado: {package}")
    except subprocess.CalledProcessError:
        print(f"❌ Error instalando {package}")

def main():
    print("\n===============================")
    print(" Instalador de dependencias 🛠")
    print("===============================")

    for pkg in REQUIRED_PACKAGES:
        install(pkg)

    print("\n✨ Todas las dependencias están listas.\n")

if __name__ == "__main__":
    main()