import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { clipboard, updownload, path, open } from "@jarvis/api-ui";
import Axios from "axios";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { CopyIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  url: z.string().url(),
});

export default function DownloadForm({ className }: { className: string }) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function checkClipboardValue() {
    const clipboardText = await clipboard.readText();

    if (
      // TODO: Improve URL validation
      clipboardText &&
      (clipboardText.includes("twitter.com") || clipboardText.includes("x.com")) &&
      clipboardText.split("/").length > 4
    )
      setUrl(clipboardText);
  }

  async function handleDownload(username: string, tweetID: string) {
    // const Writer = createWriteStream(`${DOWNLOADS_DIR}/${tweetID}.mp4`);
    const APIResponse = await Axios(`https://api.vxtwitter.com/${username}/status/${tweetID}`);
    const directURL = APIResponse.data.media_extended[0]?.url;
    if (!directURL)
      return toast({
        title: "Error",
        description: "No video found",
        variant: "destructive",
      });
    setDownloadUrl(directURL);
    const targetPath = await path.join(await path.downloadDir(), `${tweetID}.mp4`);

    updownload.download(directURL, targetPath);
    return toast({
      title: "Success",
      description: "Downloaded",
      variant: "success",
      action: (
        <ToastAction
          onClick={async () => {
            open(await path.downloadDir());
          }}
          altText="Open Downloads Folder"
        >
          Open Downloads Folder
        </ToastAction>
      ),
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const [username, tweetID] = [url.split("/")[3], url.split("/")[5]];
    if (!username || !tweetID) {
      return toast({
        title: "Error",
        description: "Invalid URL",
        variant: "destructive",
      });
    }
    handleDownload(username, tweetID);
  }

  return (
    <div className={cn("container max-w-2xl", className)}>
      <Label className="text-md">Tweet Url</Label>
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          onSubmit({ url });
        }}
        className="flex space-x-2 mt-2"
      >
        <Input
          placeholder="Enter Video URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          autoFocus
          onFocus={checkClipboardValue}
        />
        <Button type="submit">Download</Button>
      </form>
      <br />
      {downloadUrl && (
        <span className="flex">
          <small>{downloadUrl}</small>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              clipboard.writeText(downloadUrl);
              toast({
                title: "Copied",
                description: "URL copied to clipboard",
              });
            }}
          >
            <CopyIcon className="" />
          </Button>
        </span>
      )}
    </div>
  );
}
