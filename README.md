# data-wromo-id
Data wromo ID is Loader component for any website id dynamically for any page, text, images, url understands any desired variant with your own json


## Follow the next steps

create json file according to id data_wromo_id
maps json should look like the following example
To da /data/ folder

## IMPORTANT:
The /data/ folder is the only folder that is recognized by the json id import: The logic is according to the page name or url: If it is main domain or index.html, the id data is expected to be in

/data/index_structure.json

On the blog page or blog.html it is --> /data/blog_structure.json
and so on /data/NAME_structure.json

````
{
  "metadata": {
    "exportedAt": "2026-01-11T08:55:29.141Z",
    "sourceFile": "index.html",
    "totalElements": 6
  },
  "elements": [
    {
      "id": "title_new_web_222110",
      "selector": "title_new_web_222110",
      "content": "Wromo ID Change whatever you want: dynamically via npm or CDN url",
      "type": "title"

    },
    {
      "id": "a_skip_to_main_co_51306",
      "type": "a",
      "selector": "a_skip_to_main_co_51306",
      "content": "#main-content"
    },
    {
      "id": "a_facebook_80604",
      "type": "a",
      "selector": "a_facebook_80604",
      "content": "facebook"
    },
    {
      "id": "img_72992",
      "type": "img",
      "selector": "img_72992",
      "content": "/assets/new.jpg"
    },
    {
      "id": "yt-player-1",
      "type": "iframe",
      "selector": "yt-player-1",
      "videoId": "GuTcle5edjk",
      "domain": "wromo.com"
    }
  ]
}

````
data_wromo_id coordination, on the website looks like this: data_wromo_id="yt-player-1"
id entered at the beginning of each change in that row
![the changes in the json file are automatically executed.](/img/image.png)


## install npmpacket 
````
npm i data-wromo-id
````
## For Dynamic Static CDN - script:
````
<script type="module" src="https://cdn.jsdelivr.net/npm/data-wromo-id@1.0.1/data-wromo-id.js" data-url="/data/"></script>
</body>
````
## webpage raw
data_wromo_id="YOUR_RAW_ID"

## Json 
{
      "id": "YOUR_RAW_ID", "content": "XYZ", "type": "text"
    }

## Your Folder json

/data/NAME_structure.json

---


