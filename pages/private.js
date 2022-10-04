import React, { useEffect } from "react";
import SimplePeer from "simple-peer";
import download from "downloadjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../utils/firebase";
import { setDoc, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
const Private = () => {
  const [file, setFile] = React.useState();

  React.useEffect(() => {
    const p = new SimplePeer({
      initiator: !!location.hash,
      trickle: false,
    });

    p.on("error", (err) => {
      toast.error("Error occurred");
    });

    p.on("signal", (data) => {
      document.querySelector("#outgoing").textContent = JSON.stringify(data);
      if (!!location.hash) {
        document.querySelector("#id").textContent = location.hash;
        setDoc(doc(db, "signal", `${location.hash}`), {
          offer: JSON.stringify(data),
        });
      } else {
        updateDoc(
          doc(db, "signal", `${document.querySelector("#incoming").value}`),
          {
            answer: JSON.stringify(data),
          }
        );
      }
    });

    document.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!location.hash) {
        await getDoc(
          doc(db, "signal", `${document.querySelector("#incoming").value}`)
        ).then((doc) => {
          p.signal(JSON.parse(doc.data().offer));
        });
      } else {
        await getDoc(doc(db, "signal", `${location.hash}`)).then((doc) => {
          p.signal(JSON.parse(doc.data().answer));
        });
      }
    });

    p.on("connect", () => {
      toast.success("Connected successfully!");
      const input = document.getElementById("file");
      input.addEventListener("change", () => {
        const file = input.files[0];
        file.arrayBuffer().then((buffer) => {
          const chunkSize = 16 * 1024;
          while (buffer.byteLength) {
            const chunk = buffer.slice(0, chunkSize);
            buffer = buffer.slice(chunkSize, buffer.byteLength);
            p.send(chunk);
          }
          p.send("Done!");
          toast.success("file sent successfully");
        });
      });
    });

    const fileChunks = [];
    p.on("data", (data) => {
      if (data.toString() === "Done!") {
        const file = new Blob(fileChunks);
        toast.info(`${file.name} received`);
        download(file, `test.glb`);
      } else {
        fileChunks.push(data);
      }
    });
  }, []);
  return (
    <>
      <form autoComplete="off" className="flex-col center pt-10 ">
        <input
          id="incoming"
          className=" px-2 bg-transparent border rounded-md"
        />
        <button type="submit">submit</button>
      </form>

      <pre id="id"></pre>

      <pre
        id="outgoing"
        className="whitespace-normal w-screen text-center p-10 text-xs font-extralight break-words"
      ></pre>

      <label htmlFor="file">
        <svg
          width="30"
          height="30"
          fill="currentColor"
          className="cursor-pointer"
          viewBox="0 0 16 16"
        >
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
        </svg>
        <span>{file && file.name}</span>
      </label>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
        className="hidden"
        id="file"
      />
      <ToastContainer theme="dark" autoClose={2000} />
    </>
  );
};

export default Private;
