var require = meteorInstall({"client":{"main.html":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// client/main.html                                                                                   //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
module.link("./template.main.js", { "*": "*+" });

////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// client/template.main.js                                                                            //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //

Template.body.addContent((function() {
  var view = this;
  return HTML.Raw('<div id="render-target"></div>');
}));
Meteor.startup(Template.body.renderToDocument);

////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// client/main.js                                                                                     //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var render;
module.link("react-dom", {
  render: function (v) {
    render = v;
  }
}, 2);
module.link("./main.html");
module.link("../imports/startup/accounts-config.js");
var App;
module.link("../imports/ui/App.js", {
  "default": function (v) {
    App = v;
  }
}, 3);
// это функция показывает(обрабатывет)цель
Meteor.startup(function () {
  render(React.createElement(App, null), document.getElementById('render-target'));
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"imports":{"api":{"tasks.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// imports/api/tasks.js                                                                               //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
module.export({
  Tasks: function () {
    return Tasks;
  }
});
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.link("meteor/mongo", {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var check;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  }
}, 2);
var Tasks = new Mongo.Collection('tasks');

// this is api of tasks 
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function () {
    function tasksPublication() {
      return Tasks.find({
        $or: [{
          "private": {
            $ne: true
          }
        }, {
          owner: this.userId
        }]
      });
    }

    return tasksPublication;
  }());
} // 


Meteor.methods({
  'tasks.insert': function (text) {
    check(text, String); // Make sure the user is logged in before inserting a task

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } //отвечает за юзернэйм 


    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username
    });
  },
  //добавляет кнопку удаления
  'tasks.remove': function (taskId) {
    check(taskId, String);
    var task = Tasks.findOne(taskId);

    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  //кнопка где можно ставить галочку что ты сделал это дела 
  'tasks.setChecked': function (taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    var task = Tasks.findOne(taskId);

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
  'tasks.setPrivate': function (taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    var task = Tasks.findOne(taskId); // Make sure only the task owner can make a task private

    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {
      $set: {
        "private": setToPrivate
      }
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"accounts-config.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// imports/startup/accounts-config.js                                                                 //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 0);
Accounts.ui.config({
  //на сайте показывает только юзернэйм 
  passwordSignupFields: 'USERNAME_ONLY'
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ui":{"AccountsUIWrapper.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// imports/ui/AccountsUIWrapper.js                                                                    //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return AccountsUIWrapper;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var ReactDOM;
module.link("react-dom", {
  "default": function (v) {
    ReactDOM = v;
  }
}, 1);
var Template;
module.link("meteor/templating", {
  Template: function (v) {
    Template = v;
  }
}, 2);
var Blaze;
module.link("meteor/blaze", {
  Blaze: function (v) {
    Blaze = v;
  }
}, 3);

var AccountsUIWrapper =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(AccountsUIWrapper, _Component);

  function AccountsUIWrapper() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AccountsUIWrapper.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      // Use Meteor Blaze to render login buttons
      this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container));
    }

    return componentDidMount;
  }();

  _proto.componentWillUnmount = function () {
    function componentWillUnmount() {
      // Clean up Blaze view
      Blaze.remove(this.view);
    }

    return componentWillUnmount;
  }();

  _proto.render = function () {
    function render() {
      // Just render a placeholder container that will be filled in
      return React.createElement("span", {
        ref: "container"
      });
    }

    return render;
  }();

  return AccountsUIWrapper;
}(Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////

},"App.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// imports/ui/App.js                                                                                  //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var ReactDOM;
module.link("react-dom", {
  "default": function (v) {
    ReactDOM = v;
  }
}, 1);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 2);
var withTracker;
module.link("meteor/react-meteor-data", {
  withTracker: function (v) {
    withTracker = v;
  }
}, 3);
var Tasks;
module.link("../api/tasks.js", {
  Tasks: function (v) {
    Tasks = v;
  }
}, 4);
var Task;
module.link("./Task.js", {
  "default": function (v) {
    Task = v;
  }
}, 5);
var AccountsUIWrapper;
module.link("./AccountsUIWrapper.js", {
  "default": function (v) {
    AccountsUIWrapper = v;
  }
}, 6);

// App component - represents the whole app
var App =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(App, _Component);

  function App(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {
      hideCompleted: false
    };
    return _this;
  }

  var _proto = App.prototype;

  _proto.handleSubmit = function () {
    function handleSubmit(event) {
      event.preventDefault(); // Find the text field via the React ref

      var text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      Meteor.call('tasks.insert', text); // Clear form

      ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    return handleSubmit;
  }(); //когда вы закончите свои вещи, и вы нажмете на него, и он перечеркнул и стал серым


  _proto.toggleHideCompleted = function () {
    function toggleHideCompleted() {
      this.setState({
        hideCompleted: !this.state.hideCompleted
      });
    }

    return toggleHideCompleted;
  }(); //используется для фильтрации и рендеринга задач


  _proto.renderTasks = function () {
    function renderTasks() {
      var _this2 = this;

      var filteredTasks = this.props.tasks;

      if (this.state.hideCompleted) {
        filteredTasks = filteredTasks.filter(function (task) {
          return !task.checked;
        });
      }

      return filteredTasks.map(function (task) {
        var currentUserId = _this2.props.currentUser && _this2.props.currentUser._id;
        var showPrivateButton = task.owner === currentUserId;
        return React.createElement(Task, {
          key: task._id,
          task: task,
          showPrivateButton: showPrivateButton
        });
      });
    }

    return renderTasks;
  }(); ///код который отвечает за дизайн сайта 


  _proto.render = function () {
    function render() {
      return React.createElement("div", {
        className: "container"
      }, React.createElement("header", null, React.createElement("h1", null, " to do list  (", this.props.incompleteCount, ")"), React.createElement("label", {
        className: "hide-completed"
      }, React.createElement("input", {
        type: "checkbox",
        readOnly: true,
        checked: this.state.hideCompleted,
        onClick: this.toggleHideCompleted.bind(this)
      }), "Hide Completed Tasks"), React.createElement(AccountsUIWrapper, null), this.props.currentUser ? React.createElement("form", {
        className: "new-task",
        onSubmit: this.handleSubmit.bind(this)
      }, React.createElement("input", {
        type: "text",
        ref: "textInput",
        placeholder: "Type to add new tasks"
      })) : ''), React.createElement("ul", null, this.renderTasks()));
    }

    return render;
  }();

  return App;
}(Component);

module.exportDefault(withTracker(function () {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch(),
    incompleteCount: Tasks.find({
      checked: {
        $ne: true
      }
    }).count(),
    currentUser: Meteor.user()
  };
})(App));
////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// imports/ui/Task.js                                                                                 //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return Task;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var classnames;
module.link("classnames", {
  "default": function (v) {
    classnames = v;
  }
}, 2);
var Tasks;
module.link("../api/tasks.js", {
  Tasks: function (v) {
    Tasks = v;
  }
}, 3);

var Task =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(Task, _Component);

  function Task() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Task.prototype;

  _proto.toggleChecked = function () {
    function toggleChecked() {
      // Set the checked property to the opposite of its current value
      Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    return toggleChecked;
  }(); //komada dlya udalenie


  _proto.deleteThisTask = function () {
    function deleteThisTask() {
      Meteor.call('tasks.remove', this.props.task._id);
    }

    return deleteThisTask;
  }(); //delayet privatnim


  _proto.togglePrivate = function () {
    function togglePrivate() {
      Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
    }

    return togglePrivate;
  }();

  _proto.render = function () {
    function render() {
      // Give tasks a different className when they are checked off,
      // so that we can style them nicely in CSS
      var taskClassName = classnames({
        checked: this.props.task.checked,
        "private": this.props.task.private
      }); //показывает на сайте кнопки(удаление добавить и тд)

      return React.createElement("li", {
        className: taskClassName
      }, React.createElement("button", {
        className: "delete",
        onClick: this.deleteThisTask.bind(this)
      }, "\xD7"), React.createElement("input", {
        type: "checkbox",
        readOnly: true,
        checked: !!this.props.task.checked,
        onClick: this.toggleChecked.bind(this)
      }), this.props.showPrivateButton ? React.createElement("button", {
        className: "toggle-private",
        onClick: this.togglePrivate.bind(this)
      }, this.props.task.private ? 'Private' : 'Public') : '', React.createElement("span", {
        className: "text"
      }, React.createElement("strong", null, this.props.task.username), ": ", this.props.task.text));
    }

    return render;
  }();

  return Task;
}(Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css"
  ]
});

var exports = require("/client/main.js");