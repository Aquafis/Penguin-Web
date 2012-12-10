Penguin API
===========


Introduction
------------

# About
The Penguin site is driven by a MySQL data layer which handles all user, blog,
comment, and notification data. The relationships between all of these datasets is
pretty simple to model, but can sometimes lead to complex queries for visualizing said
relationships. 

As Penguin was developed in the "single page application" style, data relations are
modeled and displayed both on initial load and as consequences of user interaction.
Because of this, we have built a simple API around the data layer to provide basic
CRUD access to the data over REST principles. 

# WARNING 
At the time of this writing, the API is still in Alpha stage and is rapidly being 
developed to embody patterns and methods of organization. Therefore, there are likely
possibilities that validation data will likely be reset, query parameters will vary
and also entire resourc endpoints be vanish and appear.

The API
-------

# Authentication / Access
Currently, the API is not very secure. At the time of oficial beta release, it will
be completely locked for use of only the application itself while development
continues on the flagship launch. In tandem, will an API access system also be
implemented. This can be expected to be released late January of 2013.


# Query Parameters
## GET
* ### Size

## POST

## PUT

## DELETE



