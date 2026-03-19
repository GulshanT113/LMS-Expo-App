# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


🧠 Key Architectural Decisions

Expo Router → File-based navigation
AsyncStorage → Used for:
Bookmarks
Enrollments
Profile image persistence
Service Layer → API handling (authService, courseService)
Reusable Utilities → Bookmark storage abstraction
Notifications → Implemented using Expo Notifications
Offline Detection → Using NetInfo
Component-Based Structure → Clean and reusable components

✨ Features

🔐 Login / Register with validation
👁️ Show / Hide Password
📚 Course Listing & Course Details
⭐ Bookmark Courses
🎓 Enroll Courses
🔄 Pull-to-Refresh
🔔 Local Notifications (Bookmark & Enroll milestones)
⏰ Inactivity Reminder Notification
📶 Internet Connectivity Detection
👤 Profile Screen
Upload image (Camera + Gallery)
Persistent profile image
🌐 WebView integration

📸 Screenshots

Add the app screenshots in assets/app-screen-shots.

![Home](./screenshots/1.png)...
![Course Details](./screenshots/5.png)...
![Profile](./screenshots/14.png)...
![Login](./screenshots/24.png)...

all screenshot are available on 'app screen shots' folder.
