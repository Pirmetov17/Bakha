var require = meteorInstall({"imports":{"api":{"tasks.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// imports/api/tasks.js                                                                          //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
module.export({
  Tasks: () => Tasks
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 2);
const Tasks = new Mongo.Collection('tasks');

// this is api of tasks 
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [{
        private: {
          $ne: true
        }
      }, {
        owner: this.userId
      }]
    });
  });
} // 


Meteor.methods({
  'tasks.insert'(text) {
    check(text, String); // Make sure the user is logged in before inserting a task

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } //отвечает за юзернэйм 


    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username
    });
  },

  //добавляет кнопку удаления
  'tasks.remove'(taskId) {
    check(taskId, String);
    const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },

  //кнопка где можно ставить галочку что ты сделал это дела 
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },

  //сделать приватным чтобы только владелец видел свой ту ду лист
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    const task = Tasks.findOne(taskId); // Make sure only the task owner can make a task private

    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  }

});
///////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// server/main.js                                                                                //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
module.link("../imports/api/tasks.js");
///////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdGFza3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIlRhc2tzIiwiTWV0ZW9yIiwibGluayIsInYiLCJNb25nbyIsImNoZWNrIiwiQ29sbGVjdGlvbiIsImlzU2VydmVyIiwicHVibGlzaCIsInRhc2tzUHVibGljYXRpb24iLCJmaW5kIiwiJG9yIiwicHJpdmF0ZSIsIiRuZSIsIm93bmVyIiwidXNlcklkIiwibWV0aG9kcyIsInRleHQiLCJTdHJpbmciLCJFcnJvciIsImluc2VydCIsImNyZWF0ZWRBdCIsIkRhdGUiLCJ1c2VybmFtZSIsInVzZXJzIiwiZmluZE9uZSIsInRhc2tJZCIsInRhc2siLCJyZW1vdmUiLCJzZXRDaGVja2VkIiwiQm9vbGVhbiIsInVwZGF0ZSIsIiRzZXQiLCJjaGVja2VkIiwic2V0VG9Qcml2YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxPQUFLLEVBQUMsTUFBSUE7QUFBWCxDQUFkO0FBQWlDLElBQUlDLE1BQUo7QUFBV0gsTUFBTSxDQUFDSSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVTixNQUFNLENBQUNJLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLE9BQUssQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFNBQUssR0FBQ0QsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJRSxLQUFKO0FBQVVQLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0csT0FBSyxDQUFDRixDQUFELEVBQUc7QUFBQ0UsU0FBSyxHQUFDRixDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBSWhLLE1BQU1ILEtBQUssR0FBRyxJQUFJSSxLQUFLLENBQUNFLFVBQVYsQ0FBcUIsT0FBckIsQ0FBZDs7QUFDUDtBQUdBLElBQUlMLE1BQU0sQ0FBQ00sUUFBWCxFQUFxQjtBQUNuQjtBQUNBO0FBQ0FOLFFBQU0sQ0FBQ08sT0FBUCxDQUFlLE9BQWYsRUFBd0IsU0FBU0MsZ0JBQVQsR0FBNEI7QUFDbEQsV0FBT1QsS0FBSyxDQUFDVSxJQUFOLENBQVc7QUFDaEJDLFNBQUcsRUFBRSxDQUNIO0FBQUVDLGVBQU8sRUFBRTtBQUFFQyxhQUFHLEVBQUU7QUFBUDtBQUFYLE9BREcsRUFFSDtBQUFFQyxhQUFLLEVBQUUsS0FBS0M7QUFBZCxPQUZHO0FBRFcsS0FBWCxDQUFQO0FBTUQsR0FQRDtBQVFELEMsQ0FDRDs7O0FBQ0FkLE1BQU0sQ0FBQ2UsT0FBUCxDQUFlO0FBQ2IsaUJBQWVDLElBQWYsRUFBcUI7QUFDbkJaLFNBQUssQ0FBQ1ksSUFBRCxFQUFPQyxNQUFQLENBQUwsQ0FEbUIsQ0FHbkI7O0FBQ0EsUUFBSSxDQUFFLEtBQUtILE1BQVgsRUFBbUI7QUFDakIsWUFBTSxJQUFJZCxNQUFNLENBQUNrQixLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FBQ0QsS0FOa0IsQ0FPdkI7OztBQUNJbkIsU0FBSyxDQUFDb0IsTUFBTixDQUFhO0FBQ1hILFVBRFc7QUFFWEksZUFBUyxFQUFFLElBQUlDLElBQUosRUFGQTtBQUdYUixXQUFLLEVBQUUsS0FBS0MsTUFIRDtBQUlYUSxjQUFRLEVBQUV0QixNQUFNLENBQUN1QixLQUFQLENBQWFDLE9BQWIsQ0FBcUIsS0FBS1YsTUFBMUIsRUFBa0NRO0FBSmpDLEtBQWI7QUFNRCxHQWZZOztBQWdCYjtBQUNBLGlCQUFlRyxNQUFmLEVBQXVCO0FBQ3JCckIsU0FBSyxDQUFDcUIsTUFBRCxFQUFTUixNQUFULENBQUw7QUFFQSxVQUFNUyxJQUFJLEdBQUczQixLQUFLLENBQUN5QixPQUFOLENBQWNDLE1BQWQsQ0FBYjs7QUFDQSxRQUFJQyxJQUFJLENBQUNmLE9BQUwsSUFBZ0JlLElBQUksQ0FBQ2IsS0FBTCxLQUFlLEtBQUtDLE1BQXhDLEVBQWdEO0FBQzlDO0FBQ0EsWUFBTSxJQUFJZCxNQUFNLENBQUNrQixLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FBQ0Q7O0FBRURuQixTQUFLLENBQUM0QixNQUFOLENBQWFGLE1BQWI7QUFDRCxHQTNCWTs7QUE0QmI7QUFDQSxxQkFBbUJBLE1BQW5CLEVBQTJCRyxVQUEzQixFQUF1QztBQUNyQ3hCLFNBQUssQ0FBQ3FCLE1BQUQsRUFBU1IsTUFBVCxDQUFMO0FBQ0FiLFNBQUssQ0FBQ3dCLFVBQUQsRUFBYUMsT0FBYixDQUFMO0FBRUEsVUFBTUgsSUFBSSxHQUFHM0IsS0FBSyxDQUFDeUIsT0FBTixDQUFjQyxNQUFkLENBQWI7O0FBQ0EsUUFBSUMsSUFBSSxDQUFDZixPQUFMLElBQWdCZSxJQUFJLENBQUNiLEtBQUwsS0FBZSxLQUFLQyxNQUF4QyxFQUFnRDtBQUM5QztBQUNBLFlBQU0sSUFBSWQsTUFBTSxDQUFDa0IsS0FBWCxDQUFpQixnQkFBakIsQ0FBTjtBQUNEOztBQUVEbkIsU0FBSyxDQUFDK0IsTUFBTixDQUFhTCxNQUFiLEVBQXFCO0FBQUVNLFVBQUksRUFBRTtBQUFFQyxlQUFPLEVBQUVKO0FBQVg7QUFBUixLQUFyQjtBQUNELEdBeENZOztBQXlDYjtBQUNBLHFCQUFtQkgsTUFBbkIsRUFBMkJRLFlBQTNCLEVBQXlDO0FBQ3ZDN0IsU0FBSyxDQUFDcUIsTUFBRCxFQUFTUixNQUFULENBQUw7QUFDQWIsU0FBSyxDQUFDNkIsWUFBRCxFQUFlSixPQUFmLENBQUw7QUFFQSxVQUFNSCxJQUFJLEdBQUczQixLQUFLLENBQUN5QixPQUFOLENBQWNDLE1BQWQsQ0FBYixDQUp1QyxDQU12Qzs7QUFDQSxRQUFJQyxJQUFJLENBQUNiLEtBQUwsS0FBZSxLQUFLQyxNQUF4QixFQUFnQztBQUM5QixZQUFNLElBQUlkLE1BQU0sQ0FBQ2tCLEtBQVgsQ0FBaUIsZ0JBQWpCLENBQU47QUFDRDs7QUFFRG5CLFNBQUssQ0FBQytCLE1BQU4sQ0FBYUwsTUFBYixFQUFxQjtBQUFFTSxVQUFJLEVBQUU7QUFBRXBCLGVBQU8sRUFBRXNCO0FBQVg7QUFBUixLQUFyQjtBQUNEOztBQXREWSxDQUFmLEU7Ozs7Ozs7Ozs7O0FDckJBcEMsTUFBTSxDQUFDSSxJQUFQLENBQVkseUJBQVosRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCB7IGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmV4cG9ydCBjb25zdCBUYXNrcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCd0YXNrcycpO1xuLy8gdGhpcyBpcyBhcGkgb2YgdGFza3MgXG5cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBUaGlzIGNvZGUgb25seSBydW5zIG9uIHRoZSBzZXJ2ZXJcbiAgLy8gT25seSBwdWJsaXNoIHRhc2tzIHRoYXQgYXJlIHB1YmxpYyBvciBiZWxvbmcgdG8gdGhlIGN1cnJlbnQgdXNlclxuICBNZXRlb3IucHVibGlzaCgndGFza3MnLCBmdW5jdGlvbiB0YXNrc1B1YmxpY2F0aW9uKCkge1xuICAgIHJldHVybiBUYXNrcy5maW5kKHtcbiAgICAgICRvcjogW1xuICAgICAgICB7IHByaXZhdGU6IHsgJG5lOiB0cnVlIH0gfSxcbiAgICAgICAgeyBvd25lcjogdGhpcy51c2VySWQgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufVxuLy8gXG5NZXRlb3IubWV0aG9kcyh7XG4gICd0YXNrcy5pbnNlcnQnKHRleHQpIHtcbiAgICBjaGVjayh0ZXh0LCBTdHJpbmcpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBiZWZvcmUgaW5zZXJ0aW5nIGEgdGFza1xuICAgIGlmICghIHRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cbi8v0L7RgtCy0LXRh9Cw0LXRgiDQt9CwINGO0LfQtdGA0L3RjdC50LwgXG4gICAgVGFza3MuaW5zZXJ0KHtcbiAgICAgIHRleHQsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXG4gICAgICBvd25lcjogdGhpcy51c2VySWQsXG4gICAgICB1c2VybmFtZTogTWV0ZW9yLnVzZXJzLmZpbmRPbmUodGhpcy51c2VySWQpLnVzZXJuYW1lLFxuICAgIH0pO1xuICB9LFxuICAvL9C00L7QsdCw0LLQu9GP0LXRgiDQutC90L7Qv9C60YMg0YPQtNCw0LvQtdC90LjRj1xuICAndGFza3MucmVtb3ZlJyh0YXNrSWQpIHtcbiAgICBjaGVjayh0YXNrSWQsIFN0cmluZyk7XG5cbiAgICBjb25zdCB0YXNrID0gVGFza3MuZmluZE9uZSh0YXNrSWQpO1xuICAgIGlmICh0YXNrLnByaXZhdGUgJiYgdGFzay5vd25lciAhPT0gdGhpcy51c2VySWQpIHtcbiAgICAgIC8vIElmIHRoZSB0YXNrIGlzIHByaXZhdGUsIG1ha2Ugc3VyZSBvbmx5IHRoZSBvd25lciBjYW4gZGVsZXRlIGl0XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cblxuICAgIFRhc2tzLnJlbW92ZSh0YXNrSWQpO1xuICB9LFxuICAvL9C60L3QvtC/0LrQsCDQs9C00LUg0LzQvtC20L3QviDRgdGC0LDQstC40YLRjCDQs9Cw0LvQvtGH0LrRgyDRh9GC0L4g0YLRiyDRgdC00LXQu9Cw0Lsg0Y3RgtC+INC00LXQu9CwIFxuICAndGFza3Muc2V0Q2hlY2tlZCcodGFza0lkLCBzZXRDaGVja2VkKSB7XG4gICAgY2hlY2sodGFza0lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNldENoZWNrZWQsIEJvb2xlYW4pO1xuXG4gICAgY29uc3QgdGFzayA9IFRhc2tzLmZpbmRPbmUodGFza0lkKTtcbiAgICBpZiAodGFzay5wcml2YXRlICYmIHRhc2sub3duZXIgIT09IHRoaXMudXNlcklkKSB7XG4gICAgICAvLyBJZiB0aGUgdGFzayBpcyBwcml2YXRlLCBtYWtlIHN1cmUgb25seSB0aGUgb3duZXIgY2FuIGNoZWNrIGl0IG9mZlxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICB9XG5cbiAgICBUYXNrcy51cGRhdGUodGFza0lkLCB7ICRzZXQ6IHsgY2hlY2tlZDogc2V0Q2hlY2tlZCB9IH0pO1xuICB9LFxuICAvL9GB0LTQtdC70LDRgtGMINC/0YDQuNCy0LDRgtC90YvQvCDRh9GC0L7QsdGLINGC0L7Qu9GM0LrQviDQstC70LDQtNC10LvQtdGGINCy0LjQtNC10Lsg0YHQstC+0Lkg0YLRgyDQtNGDINC70LjRgdGCXG4gICd0YXNrcy5zZXRQcml2YXRlJyh0YXNrSWQsIHNldFRvUHJpdmF0ZSkge1xuICAgIGNoZWNrKHRhc2tJZCwgU3RyaW5nKTtcbiAgICBjaGVjayhzZXRUb1ByaXZhdGUsIEJvb2xlYW4pO1xuXG4gICAgY29uc3QgdGFzayA9IFRhc2tzLmZpbmRPbmUodGFza0lkKTtcblxuICAgIC8vIE1ha2Ugc3VyZSBvbmx5IHRoZSB0YXNrIG93bmVyIGNhbiBtYWtlIGEgdGFzayBwcml2YXRlXG4gICAgaWYgKHRhc2sub3duZXIgIT09IHRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cblxuICAgIFRhc2tzLnVwZGF0ZSh0YXNrSWQsIHsgJHNldDogeyBwcml2YXRlOiBzZXRUb1ByaXZhdGUgfSB9KTtcbiAgfSxcbn0pO1xuIiwiaW1wb3J0ICcuLi9pbXBvcnRzL2FwaS90YXNrcy5qcyc7XG4vL9C40LzQv9C+0YDRgtC40YDRi9Cy0LDQtdGCINC/0LDQv9C60YMgIl19
