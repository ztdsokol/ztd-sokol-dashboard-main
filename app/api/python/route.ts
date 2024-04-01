import { exec } from "child_process";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return new Promise((resolve, reject) => {
    exec("python3 public/test.py", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        resolve(new NextResponse("Internal error", { status: 500 }));
      } else {
        console.log(stdout);
        resolve(NextResponse.json({ output: stdout }));
      }
    });
  });
}
