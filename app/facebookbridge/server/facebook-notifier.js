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
    var user = Meteor.users.findOne({
      _id: userId,
      type: "visiter",
      visiter_type: "facebook",
    });
    if (user) {
      FacebookBridge.markAsRead(user, rid, userId, lastSeen);
    }
    return;
  },
  callbacks.priority.LOW,
  "notifyFacebookUserAfterReadMessage"
);
