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


![entity relationship diagram](https://user-images.githubusercontent.com/15388548/27516714-222e9232-59b7-11e7-925f-f10b15ab87c2.png)