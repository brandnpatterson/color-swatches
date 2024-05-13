# Color Swatches

## Run application locally

To get started, run the following:

```
npm install
```

and then

```
npm run dev
```

Next, click the Local url that dislays. For example:

```
Local:   http://localhost:5173/
```

The application will be running at that port

## Summary

This was built with Vue, underscore's throttle function, fetch. The user may select the options and then submit the form to display the colors. While the requests are being made, the form fields are disabled and the user has the option to cancel the request. This handles requests in batches to allow multiple colors to display at a time. If there are no errors and if the max number has not been hit, another batch is requested until the max is hit.

## Styling

The styling was done in a manner to display familiarity with CSS utility libraires such as Bootstrap or Tailwind, and also used a `cs-` prefix for components that needed a variety of CSS rules. Normalize CSS was added as a best practice of keeping elements inline with modern standards. The loading spinner is from https://loading.io/css/ and displays as batches are being requested.
