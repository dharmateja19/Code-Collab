import axios from "axios";
import { useState } from "react";

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const token = localStorage.getItem("token");
  console.log(token)
  const handleJoin = async () => {
    try {
      const respone = await axios.post(
        "http://localhost:3000/room/join",
        { roomId },
        {
          headers: {
            Authorization: `Bearer : ${token}`,
          },
        },
      );
      console.log(respone.data);
    } catch (error) {
      console.log(error)
      console.log(error.respone?.data || error.message);
    }
  };
  return (
    <>
      <h1>Join Room</h1>
      <input
        type="text"
        placeholder="enter room id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </>
  );
};

export default Room;
