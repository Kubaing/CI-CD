import subprocess
import sys
import os
from webdrivermanager import ChromeDriverManager, GeckoDriverManager

def install_dependencies():
    print("Installing required Python packages...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("Dependencies installed successfully.")

def download_webdrivers():
    print("Downloading WebDrivers...")
    
    # Download ChromeDriver
    chrome_manager = ChromeDriverManager()
    chrome_path = chrome_manager.download_and_install()
    
    # Download GeckoDriver (Firefox)
    gecko_manager = GeckoDriverManager()
    gecko_path = gecko_manager.download_and_install()
    
    print(f"ChromeDriver installed at: {chrome_path}")
    print(f"GeckoDriver installed at: {gecko_path}")
    
    # Add WebDriver paths to environment variables temporarily
    os.environ["PATH"] += os.pathsep + os.path.dirname(chrome_path)
    os.environ["PATH"] += os.pathsep + os.path.dirname(gecko_path)
    
    print("WebDrivers downloaded and installed successfully.")

def main():
    print("Setting up automation testing environment...")
    
    try:
        install_dependencies()
        download_webdrivers()
        
        print("\nSetup completed successfully!")
        print("You can now run the tests using: robot employee_admin_test.robot")
    except Exception as e:
        print(f"Error during setup: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 