var require = meteorInstall({"client":{"main.html":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// client/main.html                                                                                 //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.link("./template.main.js", { "*": "*+" });

//////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.main.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// client/template.main.js                                                                          //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //

Template.body.addContent((function() {
  var view = this;
  return HTML.Raw('<div id="render-target"></div>');
}));
Meteor.startup(Template.body.renderToDocument);

//////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// client/main.js                                                                                   //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 2);
module.link("./main.html");
module.link("../imports/startup/accounts-config.js");
let App;
module.link("../imports/ui/App.js", {
  default(v) {
    App = v;
  }

}, 3);
// это функция показывает(обрабатывет)цель
Meteor.startup(() => {
  render(React.createElement(App, null), document.getElementById('render-target'));
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

}},"imports":{"api":{"tasks.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/api/tasks.js                                                                             //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"accounts-config.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/startup/accounts-config.js                                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
Accounts.ui.config({
  //на сайте показывает только юзернэйм 
  passwordSignupFields: 'USERNAME_ONLY'
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ui":{"AccountsUIWrapper.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/AccountsUIWrapper.js                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.export({
  default: () => AccountsUIWrapper
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 1);
let Template;
module.link("meteor/templating", {
  Template(v) {
    Template = v;
  }

}, 2);
let Blaze;
module.link("meteor/blaze", {
  Blaze(v) {
    Blaze = v;
  }

}, 3);

class AccountsUIWrapper extends Component {
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container));
  }

  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  }

  render() {
    // Just render a placeholder container that will be filled in
    return React.createElement("span", {
      ref: "container"
    });
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"App.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/App.js                                                                                //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 3);
let Tasks;
module.link("../api/tasks.js", {
  Tasks(v) {
    Tasks = v;
  }

}, 4);
let Task;
module.link("./Task.js", {
  default(v) {
    Task = v;
  }

}, 5);
let AccountsUIWrapper;
module.link("./AccountsUIWrapper.js", {
  default(v) {
    AccountsUIWrapper = v;
  }

}, 6);

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false
    };
  }

  handleSubmit(event) {
    event.preventDefault(); // Find the text field via the React ref

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert', text); // Clear form

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  } //когда вы закончите свои вещи, и вы нажмете на него, и он перечеркнул и стал серым


  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  } //используется для фильтрации и рендеринга задач


  renderTasks() {
    let filteredTasks = this.props.tasks;

    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    return filteredTasks.map(task => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return React.createElement(Task, {
        key: task._id,
        task: task,
        showPrivateButton: showPrivateButton
      });
    });
  } ///код который отвечает за дизайн сайта 


  render() {
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

}

module.exportDefault(withTracker(() => {
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
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/Task.js                                                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.export({
  default: () => Task
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let classnames;
module.link("classnames", {
  default(v) {
    classnames = v;
  }

}, 2);
let Tasks;
module.link("../api/tasks.js", {
  Tasks(v) {
    Tasks = v;
  }

}, 3);

class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  } //komada dlya udalenie


  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  } //delayet privatnim


  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private
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

}
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css"
  ]
});

var exports = require("/client/main.js");