import Border from "@/components/Border";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Webview() {
  const { data }: any = useLocalSearchParams();
  const router = useRouter();
  // SAFE PARSE
  let course = null;
  try {
    course = data ? JSON.parse(data) : null;
  } catch (e) {
    console.log("PARSE ERROR", e);
  }

  const webRef = useRef<any>(null);

  // NO DATA UI
  if (!course) {
    return (
      <View style={styles.center}>
        <View>
          <Text style={styles.header2}>WebView Course🌐</Text>
          <Border />
        </View>

        <Text style={styles.emptyText}>
          No selected Web-view right now.
          {"\n\n"}
          Please go through the Course-Details page. If the course data is here
          then you can go for Web-view from here.
          {"\n\n"}
          Otherwise, you can visit the Home page, select one course, and then
          Course-Details page and go for Web-view.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/courseDetails")}
        >
          <Text style={styles.btnText}>Go to Course Details</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dynamic HTML
  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial; padding: 20px; background: #f5f5f5; }
          .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
          }
          button {
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>${course.title}</h2>
          <p><b>Category:</b> ${course.category}</p>
          <p><b>Instructor:</b> ${course.instructorName}</p>
          <p><b>Price:</b> ₹${course.price}</p>
          <p>${course.description}</p>

          <button onclick="sendToApp()">Send Data to App</button>
        </div>

        <script>
          function sendToApp() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: "ENROLL_CLICK",
                courseId: "${course.id}",
                title: "${course.title}"
              })
            );
          }

          document.addEventListener("message", function(event) {
            alert("From App: " + event.data);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, marginTop: 30, backgroundColor: "white" }}>
      <View style={styles.header3}>
        <Text style={styles.header}>WebView Course🌐</Text>
        <Border />
      </View>

      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        headers={{
          "X-Course-ID": String(course.id),
          "X-Course-Name": course.title,
        }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);

          if (data.type === "ENROLL_CLICK") {
            Alert.alert("Message from WebView 🎯", `Course: ${data.title}`);
          }
        }}
      />
      {/* Native → WebView */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          webRef.current?.postMessage("Hello from App 🚀");
        }}
      >
        <Text style={styles.btnText}>Send Message to WebView</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: 30,
    paddingTop: 5,
  },
  header2: {
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: 30,
  },
  header3: {
    marginRight: 5,
    marginLeft: 5,
  },

  button: {
    backgroundColor: "green",
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  // EMPTY STATE
  center: {
    marginTop: 30,
    flex: 1,
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "white",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "black",
  },
});
