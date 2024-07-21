import json
import cv2
import numpy as np
import seaborn as sns
import sys
import time


target_width = 60
src_fps = 30
target_fps = 8

def read_video(file_path: str, start_time: int, end_time: int):
    cap = cv2.VideoCapture(file_path)

    if not cap.isOpened():
        print("Error: Cannot open video file.")
        return []

    # Get video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps

    # Convert start and end time to frame indices
    start_frame = int(start_time * fps)
    end_frame = int(end_time * fps)

    # Check if start and end times are within the video duration
    if start_frame > total_frames or end_frame > total_frames:
        print("Error: Start or end time is beyond the video duration.")
        return []

    # Set the current frame position to the start frame
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

    frames = []
    current_frame = start_frame
    while cap.isOpened() and current_frame <= end_frame:
        ret, frame = cap.read()
        if not ret:
            break

        # convert frame to grayscale
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        width = frame.shape[1]
        # crop the frame in x direction, only keep the center 50%
        frame = frame[:, width // 5 : width * 4 // 5]
        # sample frame
        sample_rate = width // target_width
        frame = frame[::sample_rate, ::sample_rate]
        frame[frame < 30] = 0
        frame[frame >= 30] = 255
        # Append the frame as a numpy array (vector) to the list
        frames.append(frame)

        current_frame += 1

    frame_sample_rate = int(fps / target_fps)
    frames = frames[::frame_sample_rate]
    # Release the video capture object
    cap.release()
    return frames


# Example usage
file_path = "/Users/hacker/Desktop/kun.mp4"
# get video duration
cap = cv2.VideoCapture(file_path)
src_fps = int(cap.get(cv2.CAP_PROP_FPS))

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / src_fps
cap.release()

start_time = 0  # Start time in seconds
end_time = 14  # End time in seconds

frames = read_video(file_path, start_time, end_time)


# each frame is a 2D array, print it in terminal. if pixel is 0, use space, if pixel is 255, use '#'. refresh frame for every frame
for idx, frame in enumerate(frames):
    # print(idx, end="\r")
    print(
        "\n".join(
            ["".join(["  " if pixel == 0 else "*" for pixel in row]) for row in frame]
        ),
        end="\r",
    )
    time.sleep(1 / target_fps)  # 30 fps
    # run clear command in terminal to clear the screen
    print("\033[H\033[J", end="\r")


def serialize_frame(frame: np.ndarray) -> str:
    # convert 2D array to a single string. 0 is space, 255 is '#'. each line joined with '\n'
    return "\n".join(
        ["".join(["0" if pixel == 0 else "1" for pixel in row]) for row in frame]
    )
    # return frame.tolist()


with open("frames.json", "w") as f:
    json.dump([serialize_frame(frame) for frame in frames], f)
