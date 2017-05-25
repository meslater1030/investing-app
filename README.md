# Basic Ember App

This is a short tutorial covering the basics of [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) within an Ember app. 
We will discuss the nature and basic usage of ember-cli, the fundamentals of how Ember interacts with your JSON API and the creation of basic Templates and Routes.

#### Difficulty Level

This tutorial may be accessible to advanced or ambitious beginners but is written for developers with some
experience in writing [MVC web applications](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 
and who have a working knowledge of ES6.

If you have ever created an Ember app before you can probably skip this tutorial and try the next one.

#### Solution
This repository contains the end result of the tutorial. You'll be writing the application from scratch so no initial
clone of the repository is necessary.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/book/en/v1/Getting-Started-Installing-Git)
* [Node.js](https://nodejs.org/en/download/package-manager/)
  * NPM will be installed alongside Node.
* [Bower](https://bower.io/#install-bower) (install with NPM)
* [Ember CLI](http://www.ember-cli.com/) (install with NPM)
* [PhantomJS](https://www.npmjs.com/package/phantomjs) (install with NPM)

## Getting Started: ember-cli

 You might at this point be wondering why you've installed something called ember-cli rather than just plain Ember. ember-cli
 is Ember's command line interface and it's an easy-to-use package of opinionated build tools for Ember itself.
 In future tutorials you'll cover both ember-cli and it's foundation, [Broccoli](http://broccolijs.com/). 
 That said, until you know a little more about how to use it don't worry too much about the specific nature of ember-cli.
 This will become more clear in time. For this tutorial you'll be using it to generate the bare bones of your application, models, routes and
 components.
 
Navigate to wherever you'd like this application to belong and run the following command:

```ember new basic-ember-app```

If you were creating your own project, you'd replace `basic-ember-app` with the name of your project. You should see command
line output that looks something like the following (your results may vary slightly depending on the exact version of ember-cli
you've installed):  

```
~/Projects $ ember new ember-app
installing app
  create .editorconfig
  create .ember-cli
  create .eslintrc.js
  create .travis.yml
  create .watchmanconfig
  create README.md
  create app/app.js
  create app/components/.gitkeep
  create app/controllers/.gitkeep
  create app/helpers/.gitkeep
  create app/index.html
  create app/models/.gitkeep
  create app/resolver.js
  create app/router.js
  create app/routes/.gitkeep
  create app/styles/app.css
  create app/templates/application.hbs
  create app/templates/components/.gitkeep
  create config/environment.js
  create config/targets.js
  create ember-cli-build.js
  create .gitignore
  create package.json
  create public/crossdomain.xml
  create public/robots.txt
  create testem.js
  create tests/.eslintrc.js
  create tests/helpers/destroy-app.js
  create tests/helpers/module-for-acceptance.js
  create tests/helpers/resolver.js
  create tests/helpers/start-app.js
  create tests/index.html
  create tests/integration/.gitkeep
  create tests/test-helper.js
  create tests/unit/.gitkeep
  create vendor/.gitkeep
NPM: Installed dependencies
Successfully initialized git.
```

ember-cli has created the bones of your application for you. This includes your basic MVC setup as well as a couple of things
that are more specific to Ember. Notably, tests are also included.

To run the app use `ember serve`. The output should look something like this:

```
~/Projects/basic-ember-app $ ember serve
Livereload server on http://localhost:49153

Build successful (7995ms) – Serving on http://localhost:4200/



Slowest Nodes (totalTime => 5% )              | Total (avg)
----------------------------------------------+---------------------
Babel (15)                                    | 6882ms (458 ms)
```

Navigate to localhost:4200. You should see a page that says "Congratulations, you made it!":

### Routing
You'll start your app by retrieving a list of users and displaying them on a page. In the real world
if this is all you needed to do you'd be a fool to do it with something as heavy-weight as Ember. 
As you'll see, a fair number of steps are required set up the page for such a simple task. 
However, for the purposes of learning the framework it's helpful to start with CRUD operations
and for you the first of those will be retrieval.

You can use ember-cli to generate a route:
`ember generate route users`

output:
```
~/Projects/basic-ember-app $ ember generate route users
installing route
  create app/routes/users.js
  create app/templates/users.hbs
updating router
  add route users
installing route-test
  create tests/unit/routes/users-test.js
```

For more information about what kinds of things you can generate with ember-cli use `ember generate help`. 
In this case the command has created a blank route and template for your users. it has also added a users
route to the router and created a unit test for your new route. If you navigate to localhost:4200/users
you'll see that the page loads with the same text as the home page. In the future you'll use the new users
route and template to retrieve and display all available users. Before you can do that, you need to 
learn how data is retrieved and manipulated in Ember.

### Your API
Ember apps assume that your data will be provided via an API that follows the [JSON API specification.](http://jsonapi.org/format/)
If your API does not follow those specifications it's still possible to configure your Ember application
in another way. For this tutorial however, you'll use the JSON API provided at https://simple-investing-app.herokuapp.com.

By default, Ember will attempt to access an API from the same origin as your Ember application. So in this case http://localhost:4200. 
It's possible to specify another API origin by creating an application-wide api adapter. 

You can use ember-cli to generate an adapter.

`ember generate adapter application`

output:
```
~/Projects/basic-ember-app $ ember generate adapter application
installing adapter
  create app/adapters/application.js
installing adapter-test
  create tests/unit/adapters/application-test.js
```

Update the `basic-ember-app/app/adapters/application.js` file as follows:

```
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: 'https://simple-investing-app.herokuapp.com',
  namespace: 'api'
});
```

Now all api calls for all models will be made to `https://simple-investing-app.herokuapp.com/{someModel}`.

## Ember-Data
In this application, you're going to display information about users. Before building out templates and forms to handle that 
information you'll need a way to retrieve and manage the data itself. Ember-data is the data persistence library that comes 
pre-packaged with any Ember app. You'll be using it to create models and retrieve information from an API.

You can use ember-cli to generate an ember-data model. 

`ember generate model user firstName:string lastName:string`

output:
```
~/Projects/basic-ember-app $ ember generate model user firstName:string lastName:string
installing model
  create app/models/user.js
installing model-test
  create tests/unit/models/user-test.js
```

You've generated a model called user with a firstName and lastName attribute that are both strings. You've
also generated a unit test for that model. If you navigate to `basic-ember-app/app/models/user.js` You should see
the following:

```
import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string')
});
```

Now that you have a user model, you'll want to retrieve and 
display those users. Ember-data will
manage CRUD operations in the following way (for now, don't worry too much about what the 'store' is):

Create:

`const user = this.get('store').createRecord('user', { firstName, lastName }); user.save()` corresponds to a POST API call to `https://simple-investing-app.herokuapp.com/users`

Retrieve:

`this.get('store').findAll('user')` corresponds to a GET API call to `https://simple-investing-app.herokuapp.com/users`

`this.get('store').find('user', 1)` corresponds to a GET API call to `https://simple-investing-app.herokuapp.com/users/1`

Update:

`user.save()` corresponds to a PUT API call to `https://simple-investing-app.herokuapp.com/users/id`

Delete:

`user.delete()` corresponds to a DELETE API call to `https://simple-investing-app.herokuapp.com/users/id`.

For now, you'd just like to retrieve the available users. This can be done in a variety of ways but
you'll go ahead and use the user route you generated earlier.

## Display your users
Go to `basic-ember-app/app/routes/users` and update it to load your users.

```
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('user');
  }
});
```
As noted above, `this.get('store').findAll('user')` will make a GET API call to `https://simple-investing-app.herokuapp.com/users`
and will return every available user.

Go to `basic-ember-app/app/templates/application.hbs` and delete the default `{{welcome-page}}` found there. In the future
you'll be updating the application template to display the kind of information you would expect to see
on every page of your application (header, footer, navbar, etc). For now, the `{{outlet}}` tag will
display any information located on templates nested inside the application template. In your case this includes the user template
created earlier by ember-cli when you generated a users route.

Go to `basic-ember-app/app/templates/users.hbs` and update it to display your users.

```
{{#each model.users as |user|}} {{!-- The user variable can be given any name --}}
  <p>
    {{user.firstName}} {{user.lastName}}
  </p>
{{/each}}
```

Navigate to localhost:4200/users and you should now see a list of users.

## Create a user
Now that you've retrieved your users you want to create a new one. To do so 
we'll make use of a controller. 

You can use ember-cli to generate a controller:

`ember generate controller users`

output:
```
~/Projects/basic-ember-app $ ember generate controller users
installing controller
  create app/controllers/users.js
installing controller-test
  create tests/unit/controllers/users-test.js
```

Go to `basic-ember-app/app/controllers/users.js` and update it to include a method for creating a user.
```
import Ember from 'ember';

export default Ember.Controller.extend({
  firstName: null,
  lastName: null,
  actions: {
    createUser() {
      const user = this.get('store').createRecord('user', {
        firstName: this.get('firstName'),
        lastName: this.get('lastName')
      });
      return user.save();
    }
  }
});
```

Go to `basic-ember-app/app/templates/users.hbs` and update it to include fields for creating a user.

```
<form onsubmit={{action 'createUser'}}>
    <h3>Create a new user</h3>
    <label for="first-name">First Name</label>
    {{input id="first-name" type="text" value=firstName}}
    <label for="last-name">Last Name</label>
    {{input id="last-name" type="text" value=lastName}}
    <button type="submit">Create</button>
</form>
<h3>Existing users</h3>
{{#each model as |user|}}
  <p>
    {{user.firstName}} {{user.lastName}}
  </p>
{{/each}}

```

FAQ:

1. How are the first and last name populated?
  * These properties are bound to the template and updated as the user enters information. The exact mechanism of this
  binding is beyond the scope of this tutorial and not necessary to understand in order to proceed.
2. Why is the createUser method within another property called actions?
  * Ember automatically looks for an `actions` hook within Components, Controllers and Routes as a way to bind behavior to 
  DOM elements within the template.
3. What is this `{{action 'createUser'}}` thing?
  * This is the way in which Ember will bind methods within the actions hook to the element. In this case, the action will
  be triggered `onsubmit`. If you would prefer the action to trigger on another event (such as `onclick` or `onfocus`) then
  you could specify that event instead.
4. Where did `{{input}}` come from? Can't I just use an `<input>` html element?
  * You can use an html element for this if you prefer; binding the desired value to the value attribute on that element. 
  The `{{input}}` helper comes as a default helper with Ember and is included here so you know it exists. Helpers will
  be covered in more detail in another tutorial.
  
You should now have a very short form that collects data from the user and then creates a new user
when the 'create' button is clicked. As a matter of course you would probably want to validate this information
in some way before saving it to your database. However, for the moment we'll save the discussion on Ember validation
libraries for another time and move on.

## Update and Delete your users

Go to `basic-ember-app/app/controllers/users.js` and update the actions hook with a new method for updating a user.

```
updateUser(user) {
  return user.save();
}
```

Go to `basic-ember-app/app/templates/users.hbs` and update the template to make your new method available
to every user.

```
{{!-- Existing user form is not changed --}}
{{#each model as |user|}}
  <p>
    {{input type="text" value=user.firstName}}
    {{input type="text" value=user.lastName}}
    <button onclick={{action 'updateUser' user}}>Update</button>
  </p>
{{/each}}
```

You'll notice that you're able to pass arguments from the template into your action method
by specifying those arguments after the name of the action method in question. In this case we've passed through the user.
`user.save()` is all that's left to do to update the user. That save method will send a PUT request to `https://simple-investing-app.herokuapp.com/users/id`
to update the user.

Adding a delete method is just as simple. See whether you can implement it on your own.

## Review Questions

1. What API specification does Ember expect you to use by default?
  * In what format would you expect to receive information from a call to `myurl/api/users`? (ie. write it out)
2. What is one way you've used ember-cli to create this project?
3. How can you bind behavior to DOM elements?
4. What command do you use to start an Ember app from the command line?
5. How is information loaded in the route made available in other places?

