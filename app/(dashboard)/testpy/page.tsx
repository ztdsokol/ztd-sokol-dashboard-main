"use client";
import { Button } from "@/components/ui/button";
import { exec, spawn } from "child_process";
import axios from "axios";

/* export default function Page() {
  const handleClick = () => {
    exec("python3 test.py", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    });
  }; */

/* exec("echo hello", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  console.log(stderr);
});
exec("python3 public/test.py", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

export default function Page() {
  return (
    <div>
      <Button>Run Python</Button>
    </div>
  );
} */

function TestPyPage() {
  const handleClick = async () => {
    try {
      // Make a POST request instead of GET
      const response = await axios.post("/api/python/");
      console.log(response.data.output);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleClick}>Run Python Script</button>;
}

export default TestPyPage;
