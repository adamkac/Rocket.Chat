import { FacebookBridge } from "./index";
import { callbacks } from "../../callbacks";

callbacks.add(
  "afterSaveMessage",
  function(message, room) {
    if (room && room.t === "l" && room.v._id !== message.u._id) {
      console.log("notify", message);

      var user = Meteor.users.findOne({
        _id: room.v._id,
        type: "visiter",
        visiter_type: "facebook",
      });
      if (user) {
        FacebookBridge.sendMessage(user, message);
      }
    }

    return message;
  },
  callbacks.priority.LOW,
  "notifyFacebookUserOnMessage"
);

callbacks.add(
  "afterReadMessages",
  function(rid, userId, lastSeen) {
    console.log("mark as read", rid, userId, lastSeen);
    const query = {
      _id: rid,
    };

    var room = Rooms.findOne(query);
    if (room) {
      var user = Meteor.users.findOne({
        _id: room.v._id,
        type: "visiter",
        visiter_type: "facebook",
      });

      console.log(user);
      if (user) {
        FacebookBridge.markAsRead(user, rid, room.v._id, lastSeen);
      }
    }

    return;
  },
  callbacks.priority.LOW,
  "notifyFacebookUserAfterReadMessage"
);
