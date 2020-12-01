## Release 5.2 https://gitlab.rmcloud.com/groups/gabby/-/milestones/2
Changes:
- Operation Holiday Cheer, create a holiday themed postcard for new campaigns
- Added 4 new holiday postdard templates to choose from
- Updated the "Create new campaign" UI to accomodate more postcard types
- Fixed a bug where the edit postcard values could not be blank
- Fixed a bug that would show "undefined" in the postcard fields
- Fixed a bug where the edit campaign details would not reload when switching campaigns

## Release 5.1 https://gitlab.rmcloud.com/groups/gabby/-/milestones/3
Changes:
- User agent switcher improvements including better sorting.
- Added ability to edit Custom campaigns titles
- Added 4 new templates that can be selected for a postcard
- Added a new carousel component to help users select a template from a bigger list
- The billing page now shows the credit balance on the teams account. This balance is the credit from returned postcards
- For boards that require it, a realtor logo will show for compliance reasons
- Bugs fixed with archive postcards display
- Bugs fixed with some display agent issues on postcards 

## Release 5.0
Changes:
- Added ability to choose from different postcard sizes when creating campaigns
- Added ability to set a default postcard size for individuals and teams
- Added ability to change a postcard size when editing a campaign
- Display the postcard size for each campaign in the dashboard, billing, and campaign pages
- Update billing and refunds to accommodate new postcard sizes
- New postcard template rendering
- Show printing "bleed" and "safe area" on previews for a clearer picture of what a final print will look like
- Give suggested photo sizes when uploading custom images
- Site layout improvements

----------------
## Release 4.3

Menu styling aligns with the CRM. Move the agent switcher to the top bar.

-----------------
## Release 4.0

This version allows a user to create a campaign from an image as the front of the postcard. Therefore postcards no longer need to be tied to listings, To use this feature, a user will click the button 'Add Campaign' from the dashboard, and then choose 'Custom Campaign'.  From there they upload the front of the postcard in a JPG or PNG, choose destinations, and then they are ready to send!

-----------------
## Release 3.1.x
Changes:
- Edit campaign lets a user change a cover photo by selecting a different mls picture (left/right buttons) or upload a photo from their computer

-----------------
## Release 3.0.x
Changes:
- Edit destinations now allows for three ways to select destinations
- Enhanced automated destination selection to work much better
- Added map search, with property filtering, to select destinations
- Added CSV file upload to use as destinations
- CSV upload will detect a brivity file export format automatically
- Unknown CSV files will ask the user to pick which columns map to the destination address fields
- Added a color picker so agents can choose none standard color options for their branding

-----------------
## Release 2.7.0
Changes:
- Change the CTA url at the campaign level. Allows cta to point to a property page much easier.

-----------------
## Release 2.6.0
Changes:
- Create a campaign from an mls number.

-----------------
## Release 2.5.0
Changes:
- Postcard short url visits will trigger a lead email being sent to the notification email for the campaign.
- Postcard short url visits will create a lead in Brivity CRM.
- For sent campaigns, the details page now has a 'Download All Recipients as CSV' button.
- For sent campaigns, the page now shows a table of all destinations and their address, delivery date. status, cta count, cta date.

-----------------
## Release 2.4.0
Changes:
- First time dashboard is shown there is messaging about missing listings

Other fixes:
- Fix issue #290 More work on recursive 'Text Text RachNH to 59559 for details! to 59559 for details!'
- Fix issue #292 Improved Readme
- Fix issue #293 Work to fix various sentry recorded issues
-----------------
## Release 2.3.0
Changes:
- Add Archive dashboard functionality
- Replace image based mailout preview(s) with rendered HTML
- Improve agent & team customization preview speed
- Improve mailouts initialization and details access speed

Other fixes:
- Fix issue with dashboard & campaign details not displaying properly on mobile devices + other general display improvements

-----------------
## Release 2.2.34
Other fixes:
- Fix issue #263 - Correctly show loading state on peer switching

-----------------
## Release 2.2.33
Other fixes:
- Fix issue #259 - Only show Revert & Unlock on unsent
- Fix issue #260 - Allow a user to have no MLS# and Agent ID

-----------------
## Release 2.2.31
Changes:
- Refactor agent & team customization & improve default/custom settings handling
- Improve validation for agent & team customization
- Fix tab switching between New & Sold listings not triggering form validation in agent & team customization
- Fix Cannot read property 'max' of undefined during agent & team customization onboarding
- Fix header, sidebar, and page header borders
- Prevent empty values from being submitted to the backend
- Make CTA the default for agent & team customization
- Fix api scrubEmptyStrings method wipeing false values

Other fixes:
- Fix issue #241 [Change KWKLY code label to be more friendly]
- Fix issue #235 [KWKLY Code should error out if they don't modify the placeholder text]
- Fix issue #254 [Show address in map markers]

-----------------
## Release 2.2.11-13

Other fixes:
- Fix issue #237 [Nouislider min/max values being the same]
- Fix issue #233 [Image upload should be limited to image/jpeg and image/png only]
- Fix issue #234 [Value of personal email notification being empty during onboarding when `Same as business notification email` is selected]

----------------
## Release 2.2.0

Changes:
- Numerous design changes
- Update logo
- Improve form error functionality by implementing scroll down on submission/save
- Add agent selection dropdown for mailout edit & personal/team customizations
- Add Sentry reporting
- Remove listed/sold enable toggle switch for Personal & Teams customization
- Add loading indicator for numerous in app tasks
- Add ability to revert individual campaign changes
- Improve error display for failed authentication and prevent infinity loop on errors
- Unify forms within app to use of Formik instead Final-Forms

General Fixes:
- Fix Change Agent functionality
- Fix Snackbar display issues
- Fix MLS update loading component flashing
- Fix error message format
- Fix Team Customization slider
- Fix issue with admin peers not seeing business profile section
- Fix slider obstructing toggle space
- Fix image uploading
- Fix dropdown search
- Fix input being editable when its disabled

Other Fixes:
- Fix issue #172
- Fix issue #188
- Fix issue #218
- Fix issue #219
- Fix issue #198
- Fix issue #199
- Fix issue #208
- Fix issue #173
- Fix issue #174
- Fix issue #176
- Fix issue #182
- Fix issue #181
- Fix issue #167
- Fix issue #177
- Fix issue #178
- Fix issue #187
- Fix issue #190
- Fix issue #192
- Fix issue #180
- Fix issue #215
- Fix issue #209
- Fix issue #207
- Fix issue #194
- Fix issue #191
- Fix issue #408
