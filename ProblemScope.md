# Carpool App - Problem and Context
Purpose of this document is to provide further context regarding the Carpool App vision. This is meant mostly for the carpool app team to better understand the nature of the problem in order to derive key product insights for the carpool web application.
## Context
### Problem Overview
Every major holiday hundreds of Rice students travel back home to meet their friends or family or start work, and return back to Rice when the school picks up again, making on avergae 4 to 6 trips to and from the airport. Most students end up taking peer-to-peer
services like Uber and Lyft to ride to the airport, and the cost can easily add up. For
this reason, many student try to find other students from Rice also travelling to the 
airport aroundly the same time to carpool and share the cost with. To connect people from 
across the campus, Harrison Lin, a now graduted Rice student, creates a Google Docs sheets 
and a Facebook page. 
#### Current Situation
*What is the google docs sheets?*                                   
The current Google Docs Sheets is an excel document recording past and future carpool 
rides that contain the destination, date/time, student’s name, phone number, and other 
information. The idea is that students can enter the time they plan to leave Rice or the
airport, and if someone else matches with their time, they can contact each other and 
coordinate a ride. 

*What is wrong with google sheets?*
Although the idea aims to make the process of carpooling convinent, there are many reasons why it 
is not the most effective way of implementing the idea: 
1. It doesnt not have a smooth interface, therefore people prefer to not use it. Since all rides are on one sheet, it is hard to navigate rides, due to congestion and scrolling.
2. There are not enough successful rides, most rides on the page end up with a single person because of disregard of factors like time flexibility, so even rides that differ by 30 mins are separate rides, even if the creator of the ride has flexible timing. since they don't provide a time frame.
3. There is also the security concerns with exposing one’s personal information on a public page. Moreover, anyone can alter information on the excel sheet, such as deleting/changing information. 
4. There is no notification if a rider joins or leaves your ride, which means people either don't turn up for rides they signed up for.

#### Underserved Need
*Who are the users?*
People who will commonly use our web app will be people who care about saving money as well as frequent travelers, generally consisting of
out-of-state students. 
1. *Devika*: an international student from Bangladesh, majoring in pre-med, she travels home every summer and winter break. She hates travelling alone on uber and lyft because she doesn't feel safe, especially because she is in a foreign country and doesn't have family she could call in case anything goes wrong. 
2. *Phil*: a student entrepreneur who travels frequently around the country to advertise his small start-up and attend hackathons, sometimes flying 10 times in a semester. He is always on a small budget and therefore will travel with any stranger if the cost is lower.
*Is it important?*
Yes. Approximately 58% of Rice university students are from out of state/international locations, not including in-state student who also need transportation to the airport. Having an avenue for students to easily set up carpools with others is very beneficial to most of the student body.
*Is it being satisfied?*
No. Although the excel sheet may be enough for students to set up carpools, the entire system and process of setting up carpools could be made more efficient, secure, and successful. Students who choose not to use the excel sheet may post in their college or class page about a carpool. Moreover, student prefer not to use third-party apps like Waze carpool because they are not well-known and reliable. As for more well-established apps like uber carpool, student prefer not to travel with completely strangers.

## Problem Scope
We have two distinct problems with this situation, one of which we focus in our Minimal Viable Product and the other is a more long-term goal.
1. How might we create a reliable, regulated and user-friendly alternative to the Google Sheets Carpool document so that there is a smoother customer journey, and hence a more satisfying user experience? 
2. How might we change the process of scheduling carpools so that there are more successful carpools rides ans hence a more successful user experience?

### Current Customer Journey
1. The user finds about the website on Facebook or through a friend. They then search for the page on facebook to get the link to the google sheets.
2. They navigate through a convoluted and unadministered excel sheet to look for a date and time that matched their desired time of d  eparture, and destination. 
3. If time found, they add their name and contact information under the ride. If time not found, they scroll to the end of the page and add a new ride under their name and contact information with their desired departure time, arrival and departure location. 
4. If by the date of ride, they are the only rider in the ride, the carpool was unsuccessful and they end up travelling alone. If there are more riders in the same ride, one of the riders starts a group message or individually messages the other riders and confirm/cordinate a meet up palce and time. They also sort out logistics like luggage space to ensure there are no problems in the future. 
5. They meet up at the confirmed meet-up place and book and uber through one rider's phone, and the other riders venmo the rider their amount. 

## Interviews

*Subject 1: Sophomore, out-of-state, female*  

**How many times do you travel to and from the airport in a school year? Minimally and maximally?**  
Maximum 6 times and minimum 4 times, in winter and summer break.  

**Which airport do you usually travel to?**  
Hobby  

**How do you usually travel their? Do friends/family members drop you? Do you use peer-to-peer ride services?**  
Uber, usually.  

**If uber/lyft, what do you think about the prices?**  
It’s honestly not that bad. It’s around $20.  

**If you had the option to carpool with another Rice student, would you prefer traveling alone or carpooling? Why?**  
I would honestly carpool with a Rice student, and not because of the money, but mainly because I feel more comfortable going with someone I know studies with me. Especially if it's an early morning or late night flight, I don’t feel very comfortable travelling alone with a stranger honestly.  

*Subject 2:Sophomore, out-of-state, female* 

**How many times do you travel to / from the airport in a school year? Minimally and maximally?**  
Around 3 to 4 times, during major holidays.  

**Which airport do you usually travel to?**  
I usually go to IAH, and I travel to Ohio.  

**How do you usually travel there? Do friends/family members drop you? Do you use peer-to-peer ride services?**  
I usually split an uber with friends of use the google sheets thing to find people to share cost with because uber is like too expensive, around $45.If I can’t find anyone I travel alone though.  

**How did you find out about the google sheets?**  
I don’t remember, I think it just popped up on facebook.  

**How many times have you used the sheets and how were those experiences?**  
Well, I only used it twice. The first time it was successful and the second time it didnt work out because the other person ditched last minute. I called them and they said they weren’t planning on showing up.   

**How was your experience with navigating the googles sheets? What do you like and dislike about it?**  
I really like how convenient it is, and I like how they have organized it neatly with time and colors. I hate how there is no accountability for signing up for a ride though, like people can just bail last minute. I also dislike that it doesn’t refresh, like the rides from the last major holiday are still there and it sucks to have to scroll through all that.  

**How do you prioritize when choosing a carpool, is it by time or meeting place or riders or something else?**  
I think it’s mainly friends for me. I’m willing to go 4 hours earlier if I can go with a friend instead. That’s why one of the main sections I look at is the people in the google sheets.  

**Is security really an issue for you? Do you think people outside of rice having access to your number is a matter of concern?**  
I never really thought about it to be honest. It’s very unlikely I’ll get a stalker (laughs).  

**Have you ever used other carpool apps like waze or uber if you couldn’t find a ride on google sheets?**  
Oh no, I don't ever use uber carpool. I hate the idea of travelling with a complete stranger.

*Subject 3: Rice sophomore, out-of-state, male*  

**How many times do you travel to and from the airport in a school year?**  
Around 6 times, I think.  

**Which airport do you usually travel to? And is it out of state or out of country?**  
Hobby mainly, sometimes IAH. And I go out-of-state.  

**How do you usually travel there? Do friends/family members drop you? Do you use peer-to-peer ride services?**  
I usually share uber/lyft with friends, just to save cost.  

**How do you usually find friends to carpool with?**  
Well, I have a friend from high school who goes back around the same time every year so when I go from Rice to the airport I go with her. Coming back, I find a person though word-of-mouth or use this google sheets page on facebook. Or just ride alone.  

**How did you find out about the google sheets service?**  
I think someone posted it on the Lovett or Rice 2021 facebook page.   

**How many times have you used the google sheets? And how was your experience?**  
I’ve only used it once I think. Oh one time I used it but ended up cancelling the plan because I found a close friend to go with. The other time it didn’t work out because no one contacted me from the airport. I was waiting for them around 30 mins and their number wasn’t working either. Luckily I found a friend at the airport so I ubered with her.   
I don’t usually use the google sheets when I’m travelling from Rice to airport because I can just talk to friends here. I only use it coming back because texting everyone is very cumbersome.  

**How was your experience with navigating the googles sheets? What do you like and dislike about it?**  
I like the convenience of it, it’s a lot easier than texting friends. And I also enjoy the color coordination and the neat format. I dont like how sometimes there are overlapping rides with the same date and close times because some person was too lazy to scroll through the rides and just added their own at the end.  

**If you could add any functionality or new features to the google sheets what would you like to see?**  
I think notification would be a good add on, so I dont have to constantly check who joined and left. It would be even cooler if it could just make an automatic group chat, like on text or facebook messenger.  

**Have you ever used other carpool apps like waze or uber if you couldn’t find a ride on google sheets?**  
Uber carpool doesn’t show up as an option for me. And I havent found any other reputable app right now but if that was the case, I would use it!  

## Findings from our Customer Research 
### Students will prefer travelling with people they know rather than strangers, even if they have to go through a little extra trouble
This further highlights the need of the Carpool App, since most student will not user Uber Carpool.

### 
















