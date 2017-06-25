# WDI-Project-4
### Create a Full Stack application with Ruby on Rails and AngularJS

---
##Project Brief

Create a full stack application with a Ruby on Rails back-end and an AngularJS front-end. It is required to:

- Connect your Rails back-end to an SQL database and interact with it
- Create at least two models in the SQL database, one being a user model
- Have user authentication where the user's details are stored in the User model in the database
- Create API routes with CRUD functionality using Rails that are to be consumed by the AngularJS front-end

## Henstagenda

For my final project at General Assembly, I wanted to create an application that people everywhere could find useful and which would satisfy the prject brief. I decided to create a website where people could organise stag and hen dos since it would require many database models and because it has the potential to be useful in the real world.

As stag and hen dos can last many days and can be difficult to organise and get atendees to be in the know about the agenda, I felt that it would be a good idea to create an agenda of events so that eveyone would be in the know about what's going on at any given time. The name Henstagenda is a blend of the words 'hen', 'stag' and 'agenda'.

## Planning

In order to create the website, I needed to think about how a user would use the website to either create a stag/hen do, or join a created stag/hen do. For brevity, I am going to lay out my thought process and examples in terms of just stag dos.

### User Flow


#### Process for group creators

To create a stag do, the creator of the event would sign up to the site, click on a create group button which would lead him to a page where he would be able to create his stag group. Once inside the group, he would be able to create the agenda for the stag do which could cover several days. He would also be able to invite his friends to the stag group. The friend would need to have an account on the website beforehand to be invited to the group.

I considered inviting friends through e-mail invitations but that would have required me to do further research in order to implement which would have been unfeasible given the short amount of project time.

#### Process for group invitees

After signing up to the website, the user can be found by group admins who can invite the user to join their stag group. When a group admin invites a user/invitee, the invitee will receive a notification that they have been invited to the stag group, and will have the option to accept or decline the invitation. On accepting the invitation, the invitee will become a group member.

### Database Relationships

In order to create the project, it was essential to plan the database relationships carefully as functionality of the application would rely on it.

![preliminary database models](https://user-images.githubusercontent.com/15388548/27517180-f4962fd4-59bf-11e7-9328-80218e56f43a.jpg)
**Preliminary database model planning**

I identified the models that I wanted to incorporate in order of importance as follows:

- User
- Group
- Request
- Event
- AttendanceStatus
- GroupComment
- EventComment
- Notification (More comprehensive notifications system)
- EventFinance
- EventType

#### Associating users with groups

To make the relationship between the User model and Group model, I established the following facts:

- A user can have many groups, and a group can have many users.
	- Therefore, some sort of many-to-many relationship would be used.
- A user can be a group creator and have many groups, but a group can only have one group creator.
	- Therefore, a distinction would need to be made when a user is a group creator, and a one to many relationship with the Group model would be established.
- A join table for 'Request' would be used for the User and Group relationship to distinguish between the group creator and group members.
	- Therefore a User can have many Groups through Requests, and a Group can have many accepted or pending members through Requests. Declined members is unnecessary as the Request in that case would be deleted.

![img_20170625_150904077](https://user-images.githubusercontent.com/15388548/27517271-a6954d0e-59c1-11e7-8ac8-552c987fc11c.jpg)
**Relationship diagram for the core models for my project**

<img width="639" alt="User, Group and Request relationship showing foreign keys" src="https://user-images.githubusercontent.com/15388548/27518097-9b0dd18c-59cf-11e7-9d0a-2794f4355cc5.png">
**User, Group and Request relationship showing foreign keys and important fields**

The relationships between the User and Group models through the Request join table are:

- A user has many groups as creator
- A user has many requests as sender
- A user has many requests as receiver
- A user has many groups as member through request
- A group has many requests
- A group has many accepted members through requests
- A group has many pending members through requests

When a group creator sends a group invite/request to another user, a Request record will be created. In the Request record:

- The sender\_id will be the user\_id of the person who sent the group request (the group creator)
- The receiver\_id will be the user\_id of the person receiving the group request
- The group_id is the id of the group that the sender wants the recepient to join
- Status will be set as 'pending' by default when the Request record is created. _A group has many pending members through requests._
- When the recepient accepts a group request, the status will change to 'accepted', and they will now be a group member. _A group has many accepted members through requests._

#### Associating Events with Groups

The Group and Event models have a simple one to many relationship. A Group has many Events, and an Event belongs to one Group.

<img width="400" alt="Group and Event relationship" src="https://user-images.githubusercontent.com/15388548/27517800-26a48ac0-59ca-11e7-9687-51e55a6d9c70.png">

**Group and Event relationship showing primary and foreign keys**

#### Associating Users and Events

A feature that I wanted to implement was users being able to indicate whether or not they would be able to attend an event in a stag do. This is so that the group creator and members will be able to see how many people actually intend to show up to an event.

<img width="663" alt="user event attendancestatus" src="https://user-images.githubusercontent.com/15388548/27518281-0c6e585c-59d4-11e7-8d68-c71e690c9b92.png">
**User, Event and AttendanceStatus relationship showing foreign keys and important fields**

The relationships between the User and Event models through the AttendanceStatus join table are:

- A user has many attendance statuses
- A user has many events through attendance status
- An event has many attendance statuses
- And event has many members attending, pending and not attending through attendance status

#### Relationship diagram for the application

![entity relationship diagram](https://user-images.githubusercontent.com/15388548/27516714-222e9232-59b7-11e7-925f-f10b15ab87c2.png)
**Relationship diagram with the five models**

I had intended to incorporate more models into the project for extra functionality but time was a crucial factor in making the decision to keep it to five models.