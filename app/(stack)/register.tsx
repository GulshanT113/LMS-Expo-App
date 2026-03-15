import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { registerUser } from "../../services/authService";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(username, email, password);

      Alert.alert("Success", "Account created");

      router.replace("/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Registration Failed", "Try another email");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.inputPassword}
      />

      <Pressable onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </Pressable>

      <Text style={styles.link} onPress={() => router.push("/login")}>
        Already have an account?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  inputPassword: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

  link: {
    textAlign: "center",
    color: "#2563eb",
    marginTop: 24,
  },
});
