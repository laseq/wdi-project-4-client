# WDI-Project-4
### Create a Full Stack application with Ruby on Rails and AngularJS

---
## Project Brief

Create a full stack application with a Ruby on Rails back-end and an AngularJS front-end. It is required to:

- Connect your Rails back-end to an SQL database and interact with it
- Create at least two models in the SQL database, one being a user model
- Have user authentication where the user's details are stored in the User model in the database
- Create API routes with CRUD functionality using Rails that are to be consumed by the AngularJS front-end

## Henstagenda

For my final project at General Assembly, I wanted to create an application that people everywhere could find useful and which would satisfy the prject brief. I decided to create a website where people could organise stag and hen dos since it would require many database models and because it has the potential to be useful in the real world.

As stag and hen dos can last many days and can be difficult to organise and get atendees to be in the know about the agenda, I felt that it would be a good idea to create an agenda of events so that eveyone would be in the know about what's going on at any given time. The name Henstagenda is a blend of the words 'hen', 'stag' and 'agenda'.

View the project at [https://agile-cliffs-75809.herokuapp.com](https://agile-cliffs-75809.herokuapp.com).

## Tech Used

### Programming Languages
- Javascript
- Ruby

### Client-side
- AngularJS
- Bootstrap
- HTML/CSS/SCSS

**Dependencies:**

- angular-ui-router
- angular-resource
- angular-jwt
- angular-bootstrap
- angular-animate
- angular-moment-picker (Used for selecting the time)
- angular-bootstrap-calendar
- angular-spinners (Used for the loading spinners)

### Server-side
- Ruby on Rails
- PostgreSQL

**Gems:**

- rack-cors
- active\_model\_serializers
- bcrypt
- jwt
- figaro (Used for storing secret variables)
- activerecord-import (Used for mass creation of records)

## User Flow

In order to create the website, I needed to think about how a user would use the website to either create a stag/hen do, or join a created stag/hen do. For brevity, I am going to lay out my thought process and examples in terms of just stag dos throughout this ReadMe.

### Process for group creators

To create a stag do, the creator of the event would sign up to the site, click on a create group button which would lead him to a page where he would be able to create his stag group. Once inside the group, he would be able to create the agenda for the stag do which could cover several days. He would also be able to invite his friends to the stag group. The friend would need to have an account on the website beforehand to be invited to the group.

I considered inviting friends through e-mail invitations but that would have required me to do further research in order to implement which would have been unfeasible given the short amount of project time.

### Process for group invitees

After signing up to the website, the user can be found by group admins who can invite the user to join their stag group. When a group admin invites a user/invitee, the invitee will receive a notification that they have been invited to the stag group, and will have the option to accept or decline the invitation. On accepting the invitation, the invitee will become a group member.

### Website Plan

![img_20170625_151044540](https://user-images.githubusercontent.com/15388548/27519949-0843625e-59f7-11e7-94bf-8d953775c376.jpg)

I prefer pen and paper for my planning instead of wireframing on a computer as I find it quicker and more versatile.

## Database Relationships

In order to create the project, it was essential to plan the database relationships carefully as functionality of the application would rely on it.

**Preliminary database model planning:**
![preliminary database models](https://user-images.githubusercontent.com/15388548/27517180-f4962fd4-59bf-11e7-9328-80218e56f43a.jpg)

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

### Associating users with groups

To make the relationship between the User model and Group model, I established the following facts:

- A user can have many groups, and a group can have many users. Therefore, some sort of many-to-many relationship would be used.
- A user can be a group creator and have many groups, but a group can only have one group creator. Therefore, a distinction would need to be made when a user is a group creator, and a one to many relationship with the Group model would be established.
- A join table for 'Request' would be used for the User and Group relationship to distinguish between the group creator and group members. Therefore a User can have many Groups through Requests, and a Group can have many accepted or pending members through Requests. Declined members is unnecessary as the Request in that case would be deleted.

**Relationship diagram for the core models for my project:**
![img_20170625_150904077](https://user-images.githubusercontent.com/15388548/27517271-a6954d0e-59c1-11e7-8ac8-552c987fc11c.jpg)

**User, Group and Request relationship showing foreign keys and important fields:**
<img width="639" alt="User, Group and Request relationship showing foreign keys" src="https://user-images.githubusercontent.com/15388548/27518097-9b0dd18c-59cf-11e7-9d0a-2794f4355cc5.png">

When a group creator sends a group invite/request to another user, a Request record will be created. In the Request record:

- The sender\_id will be the user\_id of the person who sent the group request (the group creator)
- The receiver\_id will be the user\_id of the person receiving the group request
- The group_id is the id of the group that the sender wants the recepient to join
- Status will be set as 'pending' by default when the Request record is created. _A group has many pending members through requests._
- When the recepient accepts a group request, the status will change to 'accepted', and they will now be a group member. _A group has many accepted members through requests._

**The User model's relationship with Group and the Request join table:**

```
class User < ApplicationRecord
  has_many :groups_as_creator, -> { distinct }, foreign_key: "creator_id", class_name: "Group"
  
  has_many :requests_as_sender, -> { distinct }, foreign_key: "sender_id", class_name: "Request"
  has_many :requests_as_receiver, -> { distinct }, foreign_key: "receiver_id", class_name: "Request"
  has_many :accepted_requests, -> { where status: "accepted"}, foreign_key: "receiver_id", class_name: "Request"

  has_many :groups_as_member, -> { distinct }, through: :accepted_requests, source: :group
  has_many :all_groups

  def all_groups
    (self.groups_as_creator + self.groups_as_member).uniq
  end
end
```
**The Group model's relationship with User and the Request join table:**

```
class Group < ApplicationRecord
  has_many :requests, dependent: :destroy
  belongs_to :creator, :class_name => "User", :foreign_key => :creator_id
  has_many :invited_members, -> { distinct }, through: :requests, source: :receiver
  has_many :accepted_members
  has_many :pending_members

  def accepted_members
    invited_members.select { |member| member.requests_as_receiver.where(["group_id = ?", self.id]).first.status == 'accepted' }
  end

  def pending_members
    invited_members.select { |member| member.requests_as_receiver.where(["group_id = ?", self.id]).first.status == 'pending' }
  end
end
```
**The Request model's relationship with User and Group:**

```
class Request < ApplicationRecord
  belongs_to :group
  belongs_to :sender, :class_name => "User", :foreign_key => :sender_id
  belongs_to :receiver, :class_name => "User", :foreign_key => :receiver_id

  before_create :save_default_status

    private

      def save_default_status
        if self.status != 'accepted'
          self.status = 'pending'
        end
      end
end
```

### Associating Events with Groups

The Group and Event models have a simple one to many relationship. A Group has many Events, and an Event belongs to one Group.

**Group and Event relationship showing primary and foreign keys:**
<img width="400" alt="Group and Event relationship" src="https://user-images.githubusercontent.com/15388548/27517800-26a48ac0-59ca-11e7-9687-51e55a6d9c70.png">

**The Group model's relationship with the Event model:**

```
class Group < ApplicationRecord
  has_many :events, -> { order(start_time: :asc) }
  has_many :events_by_date
  scope :events_ascending_order, -> { includes(:events).order("events.start_time ASC") }

  def events_by_date
    events.group_by{ |event| event.start_time.strftime("%a %d %b %Y") }
  end
end
```
The property `events_by_date` is used to group events by their date which is used in flicking through different dates in the agenda.

`scope :events_ascending_order` creates a method for the Group model that sorts groups in ascending order of start time.

**The Event model's relationship with the Group model:**

```
class Event < ApplicationRecord
  belongs_to :group
end
```

### Associating Users and Events

A feature that I wanted to implement was users being able to indicate whether or not they would be able to attend an event in a stag do. This is so that the group creator and members will be able to see how many people actually intend to show up to an event.

**User, Event and AttendanceStatus relationship showing foreign keys and important fields:**
<img width="663" alt="user event attendancestatus" src="https://user-images.githubusercontent.com/15388548/27518281-0c6e585c-59d4-11e7-8d68-c71e690c9b92.png">

**The User model's relationship with Event and the AttendanceStatus join table:**

```
class User < ApplicationRecord
  has_many :upcoming_events

  has_many :attendance_statuses
  has_many :attending_statuses, -> { where status: "attending"}, foreign_key: "user_id", class_name: "AttendanceStatus"
  has_many :not_attending_statuses, -> { where status: "not attending"}, foreign_key: "user_id", class_name: "AttendanceStatus"
  has_many :pending_attendance_statuses, -> { where status: "pending"}, foreign_key: "user_id", class_name: "AttendanceStatus"

  has_many :events_attending, -> { distinct }, through: :attending_statuses, source: :event
  has_many :events_not_attending, -> { distinct }, through: :not_attending_statuses, source: :event
  has_many :events_pending, -> { distinct }, through: :pending_attendance_statuses, source: :event

  def upcoming_events
    self.all_groups.map(&:events).flatten.sort_by{|event| event.start_time}
  end
end
```

**The Event model's relationship with User and the AttendanceStatus join table:**

```
class Event < ApplicationRecord
  has_many :attendance_statuses, dependent: :destroy
  has_many :attending_statuses, -> { where status: "attending"}, foreign_key: "event_id", class_name: "AttendanceStatus"
  has_many :not_attending_statuses, -> { where status: "not attending"}, foreign_key: "event_id", class_name: "AttendanceStatus"
  has_many :pending_statuses, -> { where status: "pending"}, foreign_key: "event_id", class_name: "AttendanceStatus"

  has_many :members_attending, -> { distinct }, through: :attending_statuses, source: :user
  has_many :members_not_attending, -> { distinct }, through: :not_attending_statuses, source: :user
  has_many :members_pending, -> { distinct }, through: :pending_statuses, source: :user
end
```

**The AttendanceStatus join table's relationship with User and Event:**

```
class AttendanceStatus < ApplicationRecord
  belongs_to :user
  belongs_to :event
end
```

#### Relationship diagram for the application:

![entity relationship diagram](https://user-images.githubusercontent.com/15388548/27516714-222e9232-59b7-11e7-925f-f10b15ab87c2.png)

I had intended to incorporate more models into the project for extra functionality but time was a crucial factor in making the decision to keep it to five models.

## Mass Group Invites

<img width="600" alt="Group invite" src="https://user-images.githubusercontent.com/15388548/27536389-d69d17c0-5a66-11e7-82a2-b9d7b38cbe98.png">

I felt that it would be beneficial for a stag group admin if he could find many friends to invite and send a mass invite to all of them. This would:

1. Make the group invite process quicker for him as opposed to sending individual invites.
2. Use just one API call for the mass invite as opposed to multiple API calls for every single invite.

The steps to carry out the mass group invites are:

1. Find the users by their email addresses
2. Click on Invite to invite them all

### Finding users by e-mail address

To invite a user, we need to make sure that:

1. They are in the database
2. They have not already had an invite

We send a POST request with `email` and `group_id` as parameters to the custom route method `User.findByEmailWithGroup`.

```
function searchForUserByEmail() {
  const userObj = {
    email: vm.currentEmail,
    group_id: vm.group.id
  };
  User
    .findByEmailWithGroup(userObj)
    .$promise
    .then(user => {
      if (user.id && !checkIfInListAlready(user.id)) {
        vm.usersToInvite.push(user);
        vm.currentEmail = '';
      }
    });
}
```

A POST request is then made to the route `/users/search_by_email` in the User factory which handles API requests to the server side user routes.

```
return $resource(`${API}/users/:id`, { id: '@_id'}, {
  'findByEmailWithGroup': { method: 'POST', url: `${API}/users/search_by_email` }
});
```
The server side routing then directs the API request to the `search_by_email_in_group` method in the `users` controller.

`post 'users/search_by_email', to: 'users#search_by_email_in_group'`

The method in the controller then checks to see if the user has already received an invite for that group. If not, the user's information will be rendered as JSON data.

```
def search_by_email_in_group
  @user = User.find_by(email: user_params[:email])
  @group = Group.find_by_id(params[:group_id])
  @message = {:message => "This user has already received an invite"}

  if (@group.invited_members.where(email: user_params[:email]).length == 0)
    render json: @user
  elsif (@user.present?)
    render json: @message
  else
    render json: @user.errors, status: :unprocessable_entity
  end
end
```
The group admin can find and list many users in this way and set them up for a mass group invite.

### Sending the mass group invite

The `group_id` and `receiver_id` for each invitee are put in an array of objects called `massRequest` which is sent as a property of `mass_requests` in the expected format to be used server-side.

`$uibModalInstance` is closed here as the group requests occur in a modal.

```
function sendGroupJoinRequests() {
  vm.usersToInvite.forEach(user => {
    massRequest.push({ group_id: vm.group.id, receiver_id: user.id});
  });
  const massRequestObj = {
    mass_requests: massRequest
  };
  Request
    .sendMassRequest(massRequestObj)
    .$promise
    .then(data => {
      $uibModalInstance.close('Requests sent');
    });
}
```
A POST request is then made to `/group_invites/mass`

```
return $resource(`${API}/group_invites/:id`,{ id: '@_id' },
  {
    'sendMassRequest': { method: 'POST', url: `${API}/group_invites/mass`, isArray: true }
  }
);
```

The API request is received by the Rails back end and handled by the `group_invites` controller method called `mass_create`.

In order to create records en masse, I used a gem called `"activerecord-import"` which gives us the `.import` method.

In the code below, we put all the individual group requests in an array called `requests`. We then use `Request.import requests` to create the entries en masse in the Request table. The array of the requests is then rendered as JSON.

```
def mass_create
  requests = []
  group_invite_params[:mass_requests].each do |element|
    requests << @current_user.requests_as_sender.new(:group_id => element[:group_id], :receiver_id => element[:receiver_id], :status => "pending")
  end

  @invites = Request.import requests

  if @invites
    render json: requests, status: :created
  else
    render json: requests.errors, status: :unprocessable_entity
  end
end
```
**After sending the invites, the pending invites can be viewed:**
<img width="600" alt="Pending invites" src="https://user-images.githubusercontent.com/15388548/27536440-144be29a-5a67-11e7-8eb6-38587b87ea06.png">

**The invitee will receive a group request notification on their dashboard:**
<img width="369" alt="Request notification" src="https://user-images.githubusercontent.com/15388548/27536505-6cf1b5dc-5a67-11e7-9f6d-6f4a522928cd.png">

**Members can be deleted from the group:**
<img width="600" alt="Member deletion" src="https://user-images.githubusercontent.com/15388548/27536471-3f879990-5a67-11e7-9b2c-87b3a3abd184.png">

## Custom serialization for deeply nested data

For a stag/hen group page, I needed to group events by date on the server-side and render them as JSON to be consumed by AngularJS on client-side in order to get the agenda pagination working. The event cards have 'attending' and 'not attending' buttons where users can indicate whether or not they're attending an event. For this attendance feature to work, I needed to retrieve the `members_attending` details with the JSON response.

I created a custom method in the Group model to group the events by date. 

```
def events_by_date
  events.group_by{ |event| event.start_time.strftime("%a %d %b %Y") }
end
```

And expected the JSON response to be as follows:

<img width="446" alt="group.events_by_date" src="https://user-images.githubusercontent.com/15388548/27520572-3f8f2126-5a06-11e7-8fcd-01a64766f0de.png">

The image above shows the `events_by_date` object with the dates inside it. The dates contain the array of events for that day which then hold the event information.

The above JSON snippet is the JSON response in the working version of the app. However, creating the custom method `events_by_date` did not render the `members_attending`, `members_not_attending` and `members_pending` arrays as they were too deeply nested. I needed to retrieve this information to get the attendance feature working.

I wrote a custom method in the Group serializer to retrieve the attendance information.

```
def events_by_date
  customised_events_by_date = {}
  object.events_by_date.each do |date, events|
    customised_events = []
    events.each do |event|
      e1 = Event.find(event[:id])
      custom_event = e1.attributes
      custom_event[:members_attending] = e1.members_attending.select(User.column_names - ["created_at", "updated_at", "password_digest"])
      custom_event[:members_not_attending] = e1.members_not_attending.select(User.column_names - ["created_at", "updated_at", "password_digest"])
      custom_event[:members_pending] = e1.members_pending.select(User.column_names - ["created_at", "updated_at", "password_digest"])
      customised_events.push(custom_event)
    end
    customised_events_by_date[date] = customised_events
  end
  return customised_events_by_date
end
```

I created an object called `customised_events_by_date` to store the `customised_events` which are just a combination of the default Event information plus the `members_attending`, `members_not_attending` and `members_pending` fields. In this manner, using the `.events_by_date` method would now render the `members_attending` etc. fields in the JSON repsonse.

## Final Product

**User Dashboard:**

<img width="750" alt="User Dashboard" src="https://user-images.githubusercontent.com/15388548/27536549-9da11c2c-5a67-11e7-93d4-00800581388a.png">

**Group page:**

<img width="750" alt="Group page" src="https://user-images.githubusercontent.com/15388548/27536576-be211dc6-5a67-11e7-9c66-4492b6ef38e8.png">

**Agenda on group page:**

<img width="750" alt="Group agenda" src="https://user-images.githubusercontent.com/15388548/27536603-d7976dd2-5a67-11e7-9dd8-5728fbebe187.png">

**Event page that shows the members that are attending:**

<img width="750" alt="Event details" src="https://user-images.githubusercontent.com/15388548/27536639-fd31a08a-5a67-11e7-869b-045e0606d96f.png">

## Final Thoughts

I feel that Henstagenda was a success for me as I learned a lot about Ruby on Rails by creating a lot of custom methods and carrying out a lot of database manipulation. The project has definitely made me a lot more comfortable with the back-end of web development.

I got a lot more confident with AngularJS as well. I used custom routes two levels deep for the first time in my whole time at General Assembly on this project and learnt a lot about how AngularJS routing works because of it.

Another learning experience with AngularJS that I had not known before was that `ng-repeat` also gives you the key of a key-value pair if you ask for it, which was quite useful in the agenda pagination.

I found it difficult to make a gender neutral style for the website as I wanted to make it cater to two different audiences. It may have been a better idea to keep the project to just stag or hen dos as the styling decisions would have been easier and the quality of the site in general may have been better with less indecision.

### Proposed improvements

- Include group themes so that the group creator can select a theme that reflects the stag-ness or hen-ness of the group.
- Group and event discussion
- A more comprehensive notifications system where the group admin could alert all group members about actions such as changes to event times, new event or deleted events.
- A finance feature where users can see how much money they owe each other, and where the group admin can keep track of whether members have paid for certain events.
- Create event types such as dining, leisure, travel with unique options for each event type. E.g. Travel could have the option of car sharing, directions through Google Maps etc.
- The group creator should be able to make other members group admins
- The logo and home page could do with a more gender neutral design.

### Link to project:
[https://agile-cliffs-75809.herokuapp.com](https://agile-cliffs-75809.herokuapp.com)