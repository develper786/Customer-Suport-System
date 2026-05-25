# Spring Boot DevTools Setup Guide

## What is Spring Boot DevTools?

Spring Boot DevTools provides fast application restarts and live reload for a faster development experience.

**Features:**

- ✅ **Automatic Restart** - App restarts when you save Java files
- ✅ **Live Reload** - CSS, JS, HTML changes reload automatically
- ✅ **Better Development Speed** - No manual stop/restart needed
- ✅ **Works with VS Code** - Fully supported

---

## How to Use DevTools in VS Code

### **Step 1: Start the Backend**

Open a terminal and run:

```bash
cd backend
java -jar target/customer-support-api-0.0.1-SNAPSHOT.jar --server.port=9000
```

Or with Maven:

```bash
mvn spring-boot:run
```

You should see:

```...2026-05-25T... INFO ... Tomcat started on port 9000
Started CustomerSupportApiApplication
```

---

### **Step 2: Make Changes in VS Code**

Open the backend folder in VS Code:

```File → Open Folder → Customer-Suport-System/backend
```

---

### **Step 3: Edit a Java File**

For example, edit `HealthController.java`:

```java
health.put("message", "API is running perfectly!");  // Change this
```**Save the file (Ctrl+S)**
---

### **Step 4: Watch the Terminal**

DevTools will automatically:
1. Detect the file change
2. Restart the application
3. Show: `Restarting application`

You'll see:

```2026-05-25T... Started CustomerSupportApiApplication in X seconds
```

**No manual restart needed!** 🎉

---

## Configuration Options

### Add to `application.properties`

```properties
# DevTools Configuration
spring.devtools.restart.enabled=true
spring.devtools.restart.poll-interval=2000
spring.devtools.restart.quiet-period=1000
spring.devtools.livereload.enabled=true
```

---

## VS Code Extensions (Optional)

For even better experience, install:

1. **Extension Pack for Java** - Microsoft
   - Adds IDE features for Java development

2. **Live Server** - Ritwick Dey
   - Live reload for frontend changes

3. **Spring Boot Dashboard** - VMware
   - Visual dashboard for Spring Boot apps

---

## Quick Restart

If you want to manually restart:

1. Press `Ctrl+C` in the terminal
2. Run the command again to start

Or just make any change to a Java file and DevTools will restart automatically.

---

## Troubleshooting

### App not restarting on file change?

- Check if DevTools is in the JAR: `mvn dependency:tree | grep devtools`
- Make sure you saved the file (Ctrl+S)
- Check `spring.devtools.restart.enabled=true` in properties

### Changes take a long time to apply?

- This is normal for complex changes
- DevTools restarts the entire Spring context
- Usually takes 2-5 seconds

### Hot reload not working for CSS/JS?

- Make sure you're editing in `src/main/resources/static/`
- Clear browser cache (Ctrl+Shift+Delete)
- Enable Live Server extension

---

## What Gets Auto-Restarted

✅ Java class changes
✅ Configuration files
✅ Static resources (CSS, JS, HTML)

❌ Major dependency changes
❌ Test files (run tests manually)

---

## Best Practices

1. **Organize Code** - Keep related functionality together
2. **Use Annotations** - Let Spring handle dependency injection
3. **Small Changes** - Edit one thing at a time for faster restarts
4. **Check Logs** - Watch terminal for any startup errors

---

## Now You're Ready

Start developing with fast feedback loops:

```bash
# In backend folder
mvn spring-boot:run
```

Every time you save a Java file, the app restarts automatically! ⚡

Happy coding! 🚀
