# Time Management System App

## Get started

1. Run `yarn install` in the root folder
2. Run `yarn start` - this will start both the API and client app (using Yarn Workspaces)

_(If needed, the 2 servers can be started separately as well, please see the corresponding `package.json`.)_

You should now be able to access `http://localhost:3000/`!

There are 3 user types and accounts have already been created for them (see user/pass)

1. **Regular user** - _user@user.com_ / _password1_
1. **User Manager** - _m@m.com_ / _password1_
1. **Admin** - _a@a.com_ / _password1_

These were created for demo purposes, so after playing around, feel free to go to `/register` and create your own user. You may use any email address, as no confirmation is needed. The DB will also be destroyed after the interview.

This would be an example flow: you can create a simple user, create a few timecards, then use the above manager/admin account to promote the user you created and go through each level.

Any questions or problems should arise, please get in touch.

## Built with

- Client: Plain **React**
- Server: **NodeJS & Express**
- DB: **MongoDB Atlas**

The API is restful and uses JWT for authentication.

## Testing

E2E testing can be done with cypress and unit testing can be ran inside `/api` with `yarn test`, using Jest.

There are only a few tests written, but the setup should be fine and ready to accept new tests.

## Future plans (or TODOs)

Some TODO notes can already be found in code, but this is how the app can improve if more time could be allocated:

1. Use a separate auth service and remove the responsible component from the API
1. Use Redis for storing and keeping track of tokens
1. Add unit tests
1. Add more E2E tests as I only covered a small part
1. Delete all user's timecards when his account gets deleted. Currently, his timecards are not removed after his account deletion.
1. Better state management in the UI
1. Definitely other things as well
