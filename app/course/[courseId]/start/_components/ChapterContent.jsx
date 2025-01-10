import React, { useState } from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";
import { HiChevronDoubleRight, HiOutlineClipboardList } from "react-icons/hi";
import "./youtubeAdjustments.css";
import { Button } from "@/components/ui/button";

function ChapterContent({ chapter, content, handleSideBarFunction }) {
  const [selectedVideo, setselectedVideo] = useState(0);
  return (
    <div className="px-10">
      <HiChevronDoubleRight
        onClick={() => handleSideBarFunction(true)}
        className="md:hidden mb-5 cursor-pointer border-green-500 border-2 rounded-sm hover:bg-primary hover:text-white"
        size={30}
      />

      <div>
        <h2 className="font-medium text-4xl">{chapter?.ChapterName}</h2>
        <p className="text-gray-500">{chapter?.About}</p>
      </div>

      {/* Video */}
      {/* {content?.videoId && (
        <div className="video-responsive my-6">
          <YouTube
            videoId={content?.videoId}
            opts={{ playerVars: { autoplay: 0 } }}
          />
        </div>
      )} */}

      {content?.videoId ? (
        Array.isArray(content?.videoId) ? (
          <div className="video-responsive my-6">
            <YouTube
              videoId={content?.videoId[selectedVideo]}
              opts={{ playerVars: { autoplay: 0 } }}
            />
          </div>
        ) : (
          <div className="video-responsive my-6">
            <YouTube
              videoId={content?.videoId}
              opts={{ playerVars: { autoplay: 0 } }}
            />
          </div>
        )
      ) : null}

      <div className="flex gap-2 my-5 justify-center w-full">
        {content?.videoId ? (
          Array.isArray(content?.videoId) ? (
            content?.videoId?.map((item, index) => (
              <Button
                key={index}
                onClick={() => setselectedVideo(index)}
                className={`${
                  selectedVideo === index
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:text-white"
                } border-primary`}
              >
                Video {index + 1}
              </Button>
            ))
          ) : (
            <Button onClick={() => setselectedVideo(index)}>Video 1</Button>
          )
        ) : null}
      </div>

      {/* Content */}
      <div>
        {content?.content?.chapters?.map((item, index) => (
          <div key={index} className="p-5 bg-slate-50 mb-3 rounded-lg">
            <h2 className="font-medium text-lg">
              {index + 1 + ".   " + item?.title}
            </h2>

            <ReactMarkdown>{item?.explanation}</ReactMarkdown>
            {/* <p className="whitespace-pre-wrap">{item?.explanation}</p> */}

            {item?.codeExample && (
              <div className="p-4 bg-black text-gray-400 rounded-md mt-3">
                <h2 className="flex justify-end">
                  <HiOutlineClipboardList
                    onClick={async () =>
                      await navigator.clipboard.writeText(
                        item.codeExample.replace(/<\/?precode>/g, "")
                      )
                    }
                    className="cursor-pointer"
                  />
                </h2>
                <pre className="break-words whitespace-pre-wrap overflow-auto">
                  <code>{item.codeExample.replace(/<\/?precode>/g, "")}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterContent;
