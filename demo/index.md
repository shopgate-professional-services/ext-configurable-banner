# Demo

## Multiple banners with text and background color
![](text-with-bg-color.png)

**Config**
```json
{
   "banners": [
     {
       "routePattern": "/browse",
       "content": {
         "cssBackground": "#7d2424",
         "h2": "My headline text </br>",
         "h3": "With a subheadline",
         "textColor": "#fff"
       }
     },
     {
       "routePattern": "/browse",
       "content": {
         "cssBackground": "#ffef94",
         "h2": "My headline text",
         "textColor": "black"
       }
     }
   ]
 }
 ```
 
## Banner with text and background image
![](text-with-bg-img.png)

**Config**
```json
{
   "banners": [
      {
          "routePattern": "/category/:categoryId",
          "ids": [
            "671"
          ],
          "content": {
            "cssBackground": "url(https://img.freepik.com/free-photo/wall-wallpaper-concrete-colored-painted-textured-concept_53876-31799.jpg?size=626&ext=jpg) center/cover",
            "h2": "My headline text </br>",
            "h3": "With a subheadline",
            "textColor": "white"
          }
      }
   ]
 }
 ```
 
## Banner image
![](img.png)

**Config**
```json
{
   "banners": [
     {
       "routePattern": "/category/:categoryId",
       "ids": [
         "671"
       ],
       "content": {
         "imageOnlyUrl": "https://previews.123rf.com/images/kebox/kebox1605/kebox160500041/57387773-schwarze-silhouette-der-jubelnde-fu%C3%9Fballfans.jpg"
       }
     },
   ]
 }
 ```
