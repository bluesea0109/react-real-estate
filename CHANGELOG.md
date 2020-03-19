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