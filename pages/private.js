import React from "react";
import SimplePeer from "simple-peer";
import download from "downloadjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../utils/firebase";
import { setDoc, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
const Private = () => {
  const [file, setFile] = React.useState();
  const [hash, setHash] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (location.hash) {
      setHash(location.hash);
    }
  }, [hash]);

  React.useEffect(() => {
    const p = new SimplePeer({
      initiator: !!location.hash,
      trickle: false,
    });

    p.on("error", (err) => {
      console.error(err);
    });

    p.on("close", () => {
      toast.info("Connection lost");
    });

    window.addEventListener("beforeunload", () => {
      p.destroy();
    });

    p.on("signal", (data) => {
      if (!!location.hash) {
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
      await getDoc(
        doc(db, "signal", `${document.querySelector("#incoming").value}`)
      ).then((doc) => {
        p.signal(JSON.parse(doc.data().offer));
      });
    });

    document.querySelector("#received").addEventListener("click", async () => {
      await getDoc(doc(db, "signal", `${location.hash}`)).then((doc) => {
        p.signal(JSON.parse(doc.data().answer));
      });
    });

    p.on("connect", () => {
      toast.success("Connected successfully!");
      setIsConnected(true);
      if (location.hash) {
        deleteDoc(doc(db, "signal", `${location.hash}`));
      }
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
          p.send(JSON.stringify({ done: true, fileName: file.name }));
          toast.success("file sent successfully");
        });
      });
    });

    const fileChunks = [];
    p.on("data", (data) => {
      if (data.toString().includes("done")) {
        const file = new Blob(fileChunks);
        toast.info(`${JSON.parse(data).fileName} received`);
        download(file, `${JSON.parse(data).fileName}`);
      } else {
        fileChunks.push(data);
      }
    });
  }, []);
  return (
    <>
      <div className={`${isConnected && "hidden"}`}>
        <form
          autoComplete="off"
          className={`py-16 ${hash ? "hidden" : "center"} `}
        >
          <input
            id="incoming"
            placeholder="enter id to receive data"
            className=" px-3 bg-transparent border rounded-l-md"
          />
          <button
            className=" text-white font-bold px-2 rounded-r-md py-[1px] bg-green-500 "
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      <div className={`${isConnected && "hidden"}`}>
        <div className={`${!hash && "hidden"}`}>
          <h2 className="center mt-16">Share id with receiver</h2>
          <div className="center py-6 ">
            <pre className=" border rounded-l-md px-2 pt-[2px] " id="id">
              {hash}
            </pre>
            <button
              onClick={async () => {
                const id = document.querySelector("#id").textContent;
                if (navigator.share) {
                  await navigator.share();
                } else {
                  navigator.clipboard.writeText(id);
                  toast.info("ID Copied");
                }
              }}
              className="bg-green-500 text-white font-semibold px-1 pb-1 rounded-r-md"
            >
              copy
            </button>
          </div>
          <div className="pb-6 flex-col center">
            Click if user received the id
            <button
              className=" mt-5 bg-green-500 text-white font-semibold px-1 rounded-md"
              id="received"
            >
              received
            </button>
          </div>
        </div>
      </div>
      <div className={`py-16 center  ${!isConnected && " opacity-50 "}`}>
        <label
          className={`border  ${
            !isConnected ? "cursor-default" : "cursor-pointer"
          } rounded-md p-2 center `}
          htmlFor="file"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
          </svg>
          <span>{file ? file.name : "Share file"}</span>
        </label>
        <input
          type="file"
          onChange={(e) => {
            if (!isConnected) {
              e.stopPropagation();
            }
            setFile(e.target.files[0]);
          }}
          onClick={(e) => {
            if (!isConnected) {
              e.preventDefault();
            }
          }}
          className="hidden"
          id="file"
        />
      </div>
      <ToastContainer theme="dark" autoClose={2000} />
    </>
  );
};

export default Private;
