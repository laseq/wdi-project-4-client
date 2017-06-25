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

## User Flow

In order to create the website, I needed to think about how a user would use the website to either create a stag/hen do, or join a created stag/hen do. For brevity, I am going to lay out my thought process and examples in terms of just stag dos.

#### Process for group creators

To create a stag do, the creator of the event would sign up to the site, click on a create group button which would lead him to a page where he would be able to create his stag group. Once inside the group, he would be able to create the agenda for the stag do which could cover several days. He would also be able to invite his friends to the stag group. The friend would need to have an account on the website beforehand to be invited to the group.

I considered inviting friends through e-mail invitations but that would have required me to do further research in order to implement which would have been unfeasible given the short amount of project time.

#### Process for group invitees

After signing up to the website, the user can be found by group admins who can invite the user to join their stag group. When a group admin invites a user/invitee, the invitee will receive a notification that they have been invited to the stag group, and will have the option to accept or decline the invitation. On accepting the invitation, the invitee will become a group member.

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

- A user can have many groups, and a group can have many users.
	- Therefore, some sort of many-to-many relationship would be used.
- A user can be a group creator and have many groups, but a group can only have one group creator.
	- Therefore, a distinction would need to be made when a user is a group creator, and a one to many relationship with the Group model would be established.
- A join table for 'Request' would be used for the User and Group relationship to distinguish between the group creator and group members.
	- Therefore a User can have many Groups through Requests, and a Group can have many accepted or pending members through Requests. Declined members is unnecessary as the Request in that case would be deleted.

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

**Code snippet of the User model's relationship with Group and the Request join table:**

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
**Code snippet of the Group model's relationship with User and the Request join table:**

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

#### Relationship diagram for the application

![entity relationship diagram](https://user-images.githubusercontent.com/15388548/27516714-222e9232-59b7-11e7-925f-f10b15ab87c2.png)

I had intended to incorporate more models into the project for extra functionality but time was a crucial factor in making the decision to keep it to five models.

