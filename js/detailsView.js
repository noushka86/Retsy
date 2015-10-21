let	React = require('react'),
    $ = require('jquery'),
	Parse = require('parse')

var APP_ID = '1XlFKq1DMEJvO9Zj5qs5B8mxAwR3XCPiAlCeBH7R',
	JS_KEY = 'tI8klr0TiQEfOSRGu3oQad6WBpBSIAAnVUDIcy8a'

Parse.initialize(APP_ID,JS_KEY)

import UpperPanel from "./upperPanel.js"

var DetailsView=React.createClass({
	
	render:function(){

		return(
			<div id="home">
					<UpperPanel/>
					<ShopIcon shopIcon={this.props.listing[0]}/>
					<FavoritesButton/>
					<SingleListing listingData={this.props.listing[0]}/>
					
				</div>
			)
	}
})



var ShopIcon=React.createClass({
	
	_getShopName:function(listingData){
		return listingData.Shop.shop_name
	},

	_getShopIcon:function(listingData){
		if(listingData.Shop.icon_url_fullxfull===null)
		{
			return listingData.Shop.image_url_760x100
		}
		 return listingData.Shop.icon_url_fullxfull

	},

	render:function(){
		return(
			<div id="shop-icon">
				<img src={this._getShopIcon(this.props.shopIcon)}/>
	        	<h4>{this._getShopName(this.props.shopIcon)}</h4>
        	</div>
			)
	}
})

var SingleListing=React.createClass({

_getTitle:function(item){
		return item.title
	},

	_getDescription:function(item){
		return item.description
	},

	render:function(){
		console.log(this.props.listingData)
	
		var divStyle = {backgroundImage: 'url(' + this.props.listingData.MainImage.url_570xN + ')'}

	

	return(
		<div id="single-item">
			<h4 dangerouslySetInnerHTML={{__html:this._getTitle(this.props.listingData)}}></h4>
			<div id="item-img" style={divStyle}>
			<div className="arrow" id="leftA"><div id="left-arrow">&lt;</div></div>
			<div className="arrow" id="rightA"><div id="right-arrow">&gt;</div></div>
			</div>
			<p dangerouslySetInnerHTML={{__html:this._getDescription(this.props.listingData)}}></p>
			

		</div>
			)
	}
})

var FavoritesButton=React.createClass({

	_clickHandler: function(e){
		var listingObj = this.props.listingData
		// if listingObj is a backbone model, you can save with parse's REST API!
			// listingObj.save(null,{
			// 	url: 'https://api.parse.com/1/classes/Listing',
			// 	headers: {
			// 		"X-Parse-Application-Id": APP_ID,
			// 		"X-Parse-REST-API-Key": "K27MrmDmBjKXpRl5WVowlZFP7l2plPbopsK3oslV"				
			// 	}
			// }).then(function(result){
			// 	console.log(result)
			// 	console.log('saved a listing!')
			// })
		// using the parse sdk, you can save like this: 
		var db_listing = new Parse.Object('Listing')
		// var props = ['listing_id',"image_url"]
		// props.forEach(function(prop){
		// 	db_listing.set(prop,listingObj[prop])
		// })
		for (var prop in listingObj){
			db_listing.set(prop,listingObj[prop])
		}
		db_listing.save().then(function(){alert('nice save bro!')})
	},

render:function(){
	return(
		<div>
			<button>LIKE</button>
		</div>
		)
}
})

export default DetailsView
