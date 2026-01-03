# 🚀 KiddoLand AI: Android APK Guide

This repository uses GitHub Actions and PWA Builder to automatically create an Android App (.apk) for you!

## ⚠️ CRITICAL: Fix for "Repository Not Found" Error
If your GitHub Action failed with "Unable to resolve action", please check these settings:

1. **Enable GitHub Pages (MANDATORY)**:
   - Go to your repository **Settings** > **Pages**.
   - Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
   - Click **Save**.
   - **Wait 2 minutes** for your site to go live at `https://yourname.github.io/your-repo/`. The APK builder **cannot** work until the site is live.

2. **Actions Permissions**:
   - Go to **Settings** > **Actions** > **General**.
   - Under **Policies**, select **"Allow all actions and reusable workflows"**.
   - Under **Workflow permissions**, select **"Read and write permissions"**.
   - Click **Save**.

## How to download your APK:

1. **Push your code**: Ensure all files are uploaded to the `main` branch.
2. **Wait for Build**: Go to the **Actions** tab. You will see "Build Android APK" running.
3. **Success**: Once it turns green, click the build name.
4. **Download**: Scroll down to **Artifacts** at the bottom and click `kiddoland-android-apk`.
5. **Install**: Extract the ZIP and send the `.apk` to your phone. 

*Note: You may need to allow "Install from Unknown Sources" on your Android device.*