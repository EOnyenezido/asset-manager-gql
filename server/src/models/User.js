import SQL from 'sequelize';
import database from '../config/database';
import _ from 'lodash';

const User = database.define('user', {
  emailAddress: {
    type: SQL.STRING,
    allowNull: false,
    unique: true,
    isEmail: true,
    max: 200,
  },
  password: {
    type: SQL.STRING,
    allowNull: false,
    matchPasswordPolicy(value) {
      // • be a string
      // • be at least 8 characters long
      // • contain at least one number
      // • contain at least one letter
      if (!(_.isString(value) && value.length >= 8 && value.match(/[a-z]/i) && value.match(/[0-9]/))) {
        throw new Error('Password does not meet requirements!');
      }
    }
  },
  firstName: {
    type: SQL.STRING,
    allowNull: false,
    comment: 'Full representation of the user\'s first name',
    max: 50
  },

  lastName: {
    type: SQL.STRING,
    allowNull: false,
    comment: 'Full representation of the user\'s last name',
    max: 50
  },

  phoneNumber: {
    type: SQL.STRING,
    allowNull: false,
    unique: true,
    comment: 'Phone number',
    validate: {
      isPhoneNumber(value) {
        // • be a number
        // • be equal to 10 digits with leading zero removed
        if (!(_.isNumber(parseInt(value)) && value.toString().length === 10)) {
          throw new Error('Phone Number is Incorrect!');
        }
      }
    }
  },

  profileImage: {
    type: SQL.STRING,
    comment: 'Link to the user\'s profile picture',
    max: 1000,
  },

  avatarFd: {
    type: SQL.STRING,
    comment: 'Link to the user\'s profile picture',
    max: 1000,
  },

  isSuperAdmin: {
    type: 'boolean',
    comment: 'Whether this user is a "super admin" with extra permissions, etc.',
  },

  passwordResetToken: {
    type: SQL.STRING,
    comment: 'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.'
  },

  passwordResetTokenExpiresAt: {
    type: SQL.INTEGER,
    comment: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
  },

  tosAcceptedByIp: {
    type: SQL.STRING,
    comment: 'The IP (ipv4) address of the request that accepted the terms of service.'
  },

  lastSeenAt: {
    type: SQL.INTEGER,
    comment: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
  },
}, {
  defaultScope: {
    attributes: { exclude: ['isSuperAdmin'] },
  }
})

export default User;