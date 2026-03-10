export type StoryNode = {
  messages: { sender?: 'char' | 'system'; text: string; delay?: number; image?: string }[];
  choices?: { text: string; nextNode: string }[];
  timedChoice?: { duration: number; defaultNextNode: string };
  music?: 'suspense' | 'none';
  soundEffect?: 'explosion' | 'heartbeat' | 'error';
};

export const getStoryNodes = (charName: string, charGender: 'male' | 'female'): Record<string, StoryNode> => {
  const heShe = charGender === 'male' ? 'he' : 'she';
  const himHer = charGender === 'male' ? 'him' : 'her';
  const hisHer = charGender === 'male' ? 'his' : 'her';
  const boyGirl = charGender === 'male' ? 'guy' : 'girl';

  return {
    start: {
      messages: [
        { sender: 'system', text: 'CONNECTION ESTABLISHED. UNKNOWN SIGNAL DETECTED.', delay: 1000, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800' },
        { sender: 'char', text: 'Hello? Is someone there?', delay: 3000 },
        { sender: 'char', text: 'My phone has been acting crazy all day. Who is this?', delay: 2000 }
      ],
      choices: [
        { text: 'Who are you?', nextNode: 'who_are_you' },
        { text: 'Where are you?', nextNode: 'where_are_you' },
        { text: 'How is this phone connected?', nextNode: 'how_connected' }
      ]
    },
    who_are_you: {
      messages: [
        { sender: 'char', text: `My name is ${charName}. I live in Cedar Valley.`, delay: 2000 },
        { sender: 'char', text: 'I think my phone connected to a random number.', delay: 2000 }
      ],
      choices: [
        { text: 'Cedar Valley? Never heard of it.', nextNode: 'date_reveal' }
      ]
    },
    where_are_you: {
      messages: [
        { sender: 'char', text: 'I am in Cedar Valley. It\'s a small industrial town.', delay: 2000 }
      ],
      choices: [
        { text: 'Cedar Valley? Never heard of it.', nextNode: 'date_reveal' }
      ]
    },
    how_connected: {
      messages: [
        { sender: 'char', text: 'I have no idea. I was near the old radio tower and it just beeped.', delay: 2000 }
      ],
      choices: [
        { text: 'That is very strange.', nextNode: 'date_reveal' }
      ]
    },
    date_reveal: {
      messages: [
        { sender: 'char', text: 'Anyway, it\'s getting late. March 18 is almost over.', delay: 2000 },
        { sender: 'char', text: '2016 has been a weird year so far.', delay: 2000 }
      ],
      choices: [
        { text: 'Wait... 2016? It is 2026 right now.', nextNode: 'chapter_2_start' },
        { text: 'Is this some kind of prank?', nextNode: 'chapter_2_start' }
      ]
    },
    chapter_2_start: {
      messages: [
        { sender: 'char', text: '2026? Very funny. You expect me to believe you are from the future?', delay: 3000 },
        { sender: 'char', text: 'Prove it.', delay: 2000 }
      ],
      choices: [
        { text: 'Check today\'s newspaper.', nextNode: 'newspaper' },
        { text: 'Describe the town square.', nextNode: 'town_square' },
        { text: 'Take a photo of the clock tower.', nextNode: 'clock_tower' }
      ]
    },
    newspaper: {
      messages: [
        { sender: 'char', text: 'Okay, looking at the Cedar Valley Tribune.', delay: 4000 },
        { sender: 'char', text: 'Headline: "Mayor announces new chemical factory expansion". So what?', delay: 3000 }
      ],
      choices: [
        { text: 'Let me search that online...', nextNode: 'search_online' }
      ]
    },
    town_square: {
      messages: [
        { sender: 'char', text: 'It\'s quiet. The old fountain is still broken. The chemical factory is humming in the distance.', delay: 4000, image: 'https://images.unsplash.com/photo-1477346611625-1cf538bf2679?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'Let me search for your town online...', nextNode: 'search_online' }
      ]
    },
    clock_tower: {
      messages: [
        { sender: 'char', text: 'I can\'t send photos right now, signal is too weak.', delay: 3000 },
        { sender: 'char', text: 'But it says 8:45 PM. The neon sign is flickering.', delay: 2000, image: 'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'Let me search for your town online...', nextNode: 'search_online' }
      ]
    },
    search_online: {
      messages: [
        { sender: 'system', text: 'SEARCHING ARCHIVES FOR "CEDAR VALLEY 2016"...', delay: 2000 },
        { sender: 'system', text: 'MATCH FOUND. ARTICLE DATED MARCH 20, 2016.', delay: 2000 },
        { sender: 'system', text: '"TRAGEDY IN CEDAR VALLEY: Chemical factory explosion destroys town. Hundreds missing, presumed dead."', delay: 3000, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800' },
        { sender: 'char', text: 'Are you still there? What did you find?', delay: 2000 }
      ],
      music: 'suspense',
      soundEffect: 'error',
      choices: [
        { text: `${charName}... your town is going to be destroyed tomorrow.`, nextNode: 'tell_char' },
        { text: 'There is a massive explosion coming.', nextNode: 'tell_char' }
      ]
    },
    tell_char: {
      messages: [
        { sender: 'char', text: 'What? That is a sick joke.', delay: 2000 },
        { sender: 'char', text: 'The factory is perfectly safe. It provides half the jobs here.', delay: 3000 }
      ],
      choices: [
        { text: 'I am looking at the news article from the future. It happens on March 19.', nextNode: 'chapter_3_start' }
      ]
    },
    chapter_3_start: {
      messages: [
        { sender: 'char', text: 'I don\'t believe you.', delay: 2000 },
        { sender: 'char', text: 'Look, I\'m walking around right now. Everything is normal.', delay: 3000 },
        { sender: 'char', text: 'The school is empty. The bridge is clear. The factory is just doing its normal night shift.', delay: 4000, image: 'https://images.unsplash.com/photo-1580982327559-c1202864eb05?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'Look closer at the factory. Is anything unusual?', nextNode: 'factory_smoke' },
        { text: 'Are there any warning signs?', nextNode: 'factory_smoke' }
      ]
    },
    factory_smoke: {
      messages: [
        { sender: 'char', text: 'Let me get closer to the fence...', delay: 4000 },
        { sender: 'char', text: 'Wait.', delay: 2000 },
        { sender: 'char', text: 'There is smoke coming from a vent that is usually closed. And it smells like... burnt plastic and sulfur.', delay: 4000, image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'That is a chemical leak. The explosion is starting.', nextNode: 'chapter_4_start' }
      ]
    },
    chapter_4_start: {
      messages: [
        { sender: 'char', text: 'Oh my god. You might be right.', delay: 2000 },
        { sender: 'char', text: 'I hear sirens. But they are coming from INSIDE the factory compound, not the town.', delay: 3000 }
      ],
      choices: [
        { text: 'Go check the factory gates.', nextNode: 'check_factory' },
        { text: 'Stay hidden and watch.', nextNode: 'stay_hidden' },
        { text: 'Ask the security guard.', nextNode: 'ask_guard' }
      ]
    },
    check_factory: {
      messages: [
        { sender: 'char', text: 'I\'m sneaking up to the main gate.', delay: 4000 },
        { sender: 'char', text: 'The guards are gone. The gate is wide open.', delay: 3000 },
        { sender: 'char', text: 'There are men in suits loading boxes into a black van. They look panicked.', delay: 4000, image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'Sneak into the guard booth.', nextNode: 'guard_booth' },
        { text: 'Head to the Radio Tower instead.', nextNode: 'radio_tower_start' },
        { text: 'They are escaping. Let me search the archives again.', nextNode: 'chapter_5_start' }
      ]
    },
    guard_booth: {
      messages: [
        { sender: 'char', text: 'I\'m inside the booth. It\'s a mess.', delay: 3000 },
        { sender: 'char', text: 'There\'s a computer terminal left logged in. It shows a pressure warning in Sector 4.', delay: 4000 }
      ],
      choices: [
        { text: 'Look for any files or emails.', nextNode: 'booth_files' },
        { text: 'Get out of there before they see you!', nextNode: 'chapter_5_start' }
      ]
    },
    booth_files: {
      messages: [
        { sender: 'char', text: 'I found an email from the Mayor. "Initiate Protocol 7 tonight. Make sure the insurance adjusters are ready tomorrow."', delay: 5000 },
        { sender: 'char', text: 'Wait... someone is coming back to the booth!', delay: 2000 }
      ],
      soundEffect: 'heartbeat',
      choices: [
        { text: 'Hide under the desk!', nextNode: 'hide_desk' },
        { text: 'Run out the back door!', nextNode: 'run_back_door' }
      ],
      timedChoice: { duration: 6000, defaultNextNode: 'hide_desk' }
    },
    hide_desk: {
      messages: [
        { sender: 'char', text: 'I\'m under the desk. A man in a suit just walked in.', delay: 3000 },
        { sender: 'char', text: 'He grabbed a radio and left. That was too close.', delay: 3000 }
      ],
      choices: [
        { text: 'Get out of there now. Let me check the archives.', nextNode: 'chapter_5_start' }
      ]
    },
    run_back_door: {
      messages: [
        { sender: 'char', text: 'I slipped out the back just as he walked in.', delay: 3000 },
        { sender: 'char', text: 'I\'m back in the shadows.', delay: 2000 }
      ],
      choices: [
        { text: 'Good. Let me check the archives to see what happens next.', nextNode: 'chapter_5_start' }
      ]
    },
    stay_hidden: {
      messages: [
        { sender: 'char', text: 'I\'m hiding behind a dumpster across the street.', delay: 4000 },
        { sender: 'char', text: 'A black van just sped out of the gates. No headlights.', delay: 3000 }
      ],
      choices: [
        { text: 'Head to the Radio Tower instead.', nextNode: 'radio_tower_start' },
        { text: 'They are escaping. Let me search the archives again.', nextNode: 'chapter_5_start' }
      ]
    },
    ask_guard: {
      messages: [
        { sender: 'char', text: 'I\'m walking up to the booth...', delay: 4000 },
        { sender: 'char', text: 'It\'s empty. The radio is left on, just static.', delay: 3000 }
      ],
      choices: [
        { text: 'Head to the Radio Tower instead.', nextNode: 'radio_tower_start' },
        { text: 'They abandoned it. Let me search the archives again.', nextNode: 'chapter_5_start' }
      ]
    },
    radio_tower_start: {
      messages: [
        { sender: 'char', text: 'I\'m heading up the hill to the old radio tower.', delay: 3000 },
        { sender: 'char', text: 'If I can get the broadcast system working, I can warn everyone at once.', delay: 3000 }
      ],
      choices: [
        { text: 'Hurry, the explosion is going to happen soon!', nextNode: 'radio_tower_inside' }
      ]
    },
    radio_tower_inside: {
      messages: [
        { sender: 'char', text: 'I broke the lock. I\'m inside the control room.', delay: 3000 },
        { sender: 'char', text: 'The equipment is ancient. There are three main switches.', delay: 3000 }
      ],
      choices: [
        { text: 'Flip the red switch!', nextNode: 'radio_red' },
        { text: 'Flip the blue switch!', nextNode: 'radio_blue' }
      ],
      timedChoice: { duration: 8000, defaultNextNode: 'radio_fail' }
    },
    radio_red: {
      messages: [
        { sender: 'char', text: 'Power is on! The microphone is live!', delay: 2000 },
        { sender: 'char', text: 'I\'m broadcasting on all emergency frequencies!', delay: 3000 }
      ],
      choices: [
        { text: 'Tell them to evacuate immediately!', nextNode: 'radio_success' }
      ]
    },
    radio_blue: {
      messages: [
        { sender: 'char', text: 'Sparks are flying! I short-circuited the system!', delay: 3000 },
        { sender: 'char', text: 'The power is dead. I can\'t warn anyone now.', delay: 3000 }
      ],
      soundEffect: 'error',
      choices: [
        { text: 'Get out of there and run to the forest!', nextNode: 'run_forest' }
      ]
    },
    radio_fail: {
      messages: [
        { sender: 'char', text: 'I took too long! The power just cut out completely.', delay: 3000 }
      ],
      choices: [
        { text: 'Get out of there and run to the forest!', nextNode: 'run_forest' }
      ]
    },
    radio_success: {
      messages: [
        { sender: 'char', text: '"ATTENTION CEDAR VALLEY! EVACUATE THE TOWN IMMEDIATELY! THE FACTORY IS ABOUT TO EXPLODE!"', delay: 4000 },
        { sender: 'char', text: 'I can hear sirens starting up in the town. People are waking up!', delay: 3000 },
        { sender: 'char', text: 'Wait... someone is banging on the tower door.', delay: 3000 }
      ],
      soundEffect: 'heartbeat',
      choices: [
        { text: 'Barricade the door!', nextNode: 'radio_barricade' },
        { text: 'Climb up the antenna!', nextNode: 'radio_climb' }
      ],
      timedChoice: { duration: 7000, defaultNextNode: 'radio_caught' }
    },
    radio_barricade: {
      messages: [
        { sender: 'char', text: 'I pushed a heavy desk against the door.', delay: 3000 },
        { sender: 'char', text: 'They\'re trying to break it down. It\'s the Mayor\'s men.', delay: 3000 },
        { sender: 'char', text: 'The factory just exploded! I can see it from the window!', delay: 3000, image: 'https://images.unsplash.com/photo-1542267258-1502b4899c92?auto=format&fit=crop&q=80&w=800' }
      ],
      soundEffect: 'explosion',
      choices: [
        { text: 'Hold the door!', nextNode: 'ending_radio_hero' }
      ]
    },
    radio_climb: {
      messages: [
        { sender: 'char', text: 'I\'m climbing the ladder to the roof.', delay: 3000 },
        { sender: 'char', text: 'They broke in! They\'re shooting at me!', delay: 2000 }
      ],
      soundEffect: 'heartbeat',
      choices: [
        { text: 'Keep climbing!', nextNode: 'radio_caught' }
      ]
    },
    radio_caught: {
      messages: [
        { sender: 'char', text: 'They got me... I\'m hit...', delay: 3000 },
        { sender: 'char', text: 'But I can see the cars leaving town. I saved them...', delay: 3000 }
      ],
      choices: [
        { text: 'You\'re a hero.', nextNode: 'ending_sacrifice' }
      ]
    },
    ending_radio_hero: {
      messages: [
        { sender: 'char', text: 'The shockwave hit the tower. The men ran away.', delay: 3000 },
        { sender: 'char', text: 'I survived. And the town evacuated in time.', delay: 3000 },
        { sender: 'char', text: 'Thank you for believing me.', delay: 2000 },
        { sender: 'system', text: 'MASS CASUALTY EVENT AVERTED. TIMELINE SECURED.', delay: 3000 }
      ],
      music: 'none'
    },
    ending_sacrifice: {
      messages: [
        { sender: 'system', text: 'SIGNAL LOST. CONNECTION TERMINATED.', delay: 2000 },
        { sender: 'system', text: 'TOWN CASUALTIES: 0. HERO CASUALTIES: 1.', delay: 3000 }
      ],
      music: 'none'
    },
    chapter_5_start: {
      messages: [
        { sender: 'system', text: 'ACCESSING CLASSIFIED INCIDENT REPORTS...', delay: 2000 }
      ],
      choices: [
        { text: 'Search "Cedar Valley Factory Sabotage"', nextNode: 'search_sabotage' },
        { text: 'Search "Cedar Valley Evacuation"', nextNode: 'search_evac' }
      ]
    },
    search_evac: {
      messages: [
        { sender: 'system', text: 'NO EVACUATION WAS ORDERED. TOWN WAS CAUGHT OFF GUARD.', delay: 2000 }
      ],
      choices: [
        { text: 'Search "Cedar Valley Factory Sabotage"', nextNode: 'search_sabotage' }
      ]
    },
    search_sabotage: {
      messages: [
        { sender: 'system', text: 'DECRYPTING FILE...', delay: 2000 },
        { sender: 'system', text: 'REPORT: "Explosion was not an accident. Pressure valves in Sector 4 were manually overridden to cause a catastrophic chain reaction."', delay: 4000 },
        { sender: 'system', text: 'SUSPECT: Mayor Thomas. Motive: Multi-million dollar insurance fraud.', delay: 3000 }
      ],
      choices: [
        { text: `${charName}, it is sabotage! The Mayor did it!`, nextNode: 'chapter_6_start' }
      ]
    },
    chapter_6_start: {
      messages: [
        { sender: 'char', text: 'The Mayor?! That\'s impossible. He built this town.', delay: 3000 },
        { sender: 'char', text: 'Why should I believe anything you say? This is insane.', delay: 2000 }
      ],
      choices: [
        { text: 'I know about the green smoke. I know the guards left.', nextNode: 'convince_logic' },
        { text: 'If you don\'t believe me, you will die tonight.', nextNode: 'convince_fear' }
      ]
    },
    convince_logic: {
      messages: [
        { sender: 'char', text: '...You couldn\'t know about the guards unless you were here. Or unless it\'s history.', delay: 4000 },
        { sender: 'char', text: 'Okay. Okay, I believe you. I\'m terrified. What do I do?', delay: 3000 }
      ],
      choices: [
        { text: 'We need to get you out of there.', nextNode: 'chapter_7_start' }
      ]
    },
    convince_fear: {
      messages: [
        { sender: 'char', text: '...You\'re scaring me.', delay: 3000 },
        { sender: 'char', text: 'But everything you said is happening. Okay. What do I do?', delay: 3000 }
      ],
      choices: [
        { text: 'We need to get you out of there.', nextNode: 'chapter_7_start' }
      ]
    },
    chapter_7_start: {
      messages: [
        { sender: 'char', text: 'The factory lights just went out completely.', delay: 2000 },
        { sender: 'char', text: 'The ground is shaking.', delay: 2000 }
      ],
      choices: [
        { text: 'Call the police!', nextNode: 'call_police' },
        { text: 'Run to the forest!', nextNode: 'run_forest' },
        { text: 'Warn your neighbors!', nextNode: 'warn_neighbors' }
      ],
      timedChoice: { duration: 15000, defaultNextNode: 'too_late_1' }
    },
    too_late_1: {
      messages: [
        { sender: 'char', text: 'Are you there?! I don\'t know what to do!', delay: 2000 }
      ],
      choices: [
        { text: 'Run to the forest!', nextNode: 'run_forest' }
      ]
    },
    call_police: {
      messages: [
        { sender: 'char', text: 'I\'m dialing 911...', delay: 3000 },
        { sender: 'char', text: 'Dead air. The cell towers must be jammed or down.', delay: 3000 }
      ],
      choices: [
        { text: 'You have to run to the forest!', nextNode: 'run_forest' }
      ]
    },
    warn_neighbors: {
      messages: [
        { sender: 'char', text: 'I\'m banging on doors on my street!', delay: 3000 },
        { sender: 'char', text: 'No one is waking up. There\'s no time!', delay: 3000 }
      ],
      choices: [
        { text: 'Leave them! Run to the forest!', nextNode: 'run_forest' }
      ]
    },
    run_forest: {
      messages: [
        { sender: 'char', text: 'I\'m running. I\'m heading towards the tree line.', delay: 3000, image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'Keep going. Don\'t stop.', nextNode: 'chapter_8_start' }
      ]
    },
    chapter_8_start: {
      messages: [
        { sender: 'char', text: 'OH MY GOD!', delay: 1000 },
        { sender: 'char', text: 'THE FACTORY JUST EXPLODED!', delay: 1000, image: 'https://images.unsplash.com/photo-1542267258-1502b4899c92?auto=format&fit=crop&q=80&w=800' },
        { sender: 'char', text: 'The shockwave knocked me down. My ears are ringing.', delay: 3000 },
        { sender: 'char', text: 'There is fire everywhere. The sky is orange.', delay: 3000 }
      ],
      soundEffect: 'explosion',
      choices: [
        { text: 'Get up! Which way is clear?', nextNode: 'escape_route' }
      ]
    },
    escape_route: {
      messages: [
        { sender: 'char', text: 'I can take the main road, the bridge, or the dirt path by the river.', delay: 3000 }
      ],
      choices: [
        { text: 'Take the main road!', nextNode: 'main_road' },
        { text: 'Take the bridge!', nextNode: 'bridge' },
        { text: 'Take the dirt path!', nextNode: 'dirt_path' }
      ],
      timedChoice: { duration: 10000, defaultNextNode: 'main_road' }
    },
    main_road: {
      messages: [
        { sender: 'char', text: 'It\'s blocked! A chemical truck overturned. It\'s spilling acid!', delay: 3000, image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'Turn back! Try the dirt path!', nextNode: 'dirt_path' }
      ]
    },
    bridge: {
      messages: [
        { sender: 'char', text: 'The bridge is gone. The explosion took it out.', delay: 3000, image: 'https://images.unsplash.com/photo-1506015391300-415c14d759cb?auto=format&fit=crop&q=80&w=800' }
      ],
      choices: [
        { text: 'Turn back! Try the dirt path!', nextNode: 'dirt_path' }
      ]
    },
    dirt_path: {
      messages: [
        { sender: 'char', text: 'I\'m on the dirt path. The smoke is thick. It\'s hard to breathe.', delay: 4000 }
      ],
      choices: [
        { text: 'Cover your mouth with your shirt. Keep moving.', nextNode: 'toxic_gas' }
      ]
    },
    toxic_gas: {
      messages: [
        { sender: 'char', text: 'My eyes are burning. The gas is spreading fast.', delay: 3000 },
        { sender: 'char', text: 'I see a small abandoned cabin up ahead.', delay: 3000 }
      ],
      choices: [
        { text: 'Go inside the cabin to take shelter!', nextNode: 'cabin_shelter' },
        { text: 'Ignore it, keep running to the forest!', nextNode: 'chapter_9_start' }
      ]
    },
    cabin_shelter: {
      messages: [
        { sender: 'char', text: 'I\'m inside. I shut the door and stuffed rags under the crack.', delay: 4000 },
        { sender: 'char', text: 'It\'s safer in here, but I\'m trapped. The fire is spreading towards the cabin.', delay: 4000 }
      ],
      soundEffect: 'heartbeat',
      choices: [
        { text: 'You can\'t stay there! Break a window and run!', nextNode: 'break_window' },
        { text: 'Wait for the fire to pass!', nextNode: 'wait_fire' }
      ],
      timedChoice: { duration: 8000, defaultNextNode: 'wait_fire' }
    },
    wait_fire: {
      messages: [
        { sender: 'char', text: 'The smoke is getting thicker inside...', delay: 3000 },
        { sender: 'char', text: 'I can\'t breathe...', delay: 3000 }
      ],
      choices: [
        { text: `${charName}! Get out!`, nextNode: 'ending_tragic' }
      ]
    },
    break_window: {
      messages: [
        { sender: 'char', text: 'I broke the back window! I\'m climbing out!', delay: 3000 },
        { sender: 'char', text: 'I\'m back on the path, ahead of the flames.', delay: 3000 }
      ],
      choices: [
        { text: 'Keep moving towards the forest!', nextNode: 'chapter_9_start' }
      ]
    },
    chapter_9_start: {
      messages: [
        { sender: 'char', text: 'Wait.', delay: 2000 },
        { sender: 'char', text: 'There is someone on the path ahead of me.', delay: 3000 },
        { sender: 'char', text: 'It\'s Mayor Thomas. He\'s watching the town burn. He\'s holding a remote detonator.', delay: 4000 }
      ],
      choices: [
        { text: 'Take a photo of him as proof!', nextNode: 'take_photo' },
        { text: 'Hide and sneak past him!', nextNode: 'hide_run' }
      ],
      timedChoice: { duration: 8000, defaultNextNode: 'take_photo' }
    },
    take_photo: {
      messages: [
        { sender: 'char', text: 'Okay. I\'m taking it.', delay: 3000 },
        { sender: 'char', text: 'CRAP! THE FLASH WENT OFF!', delay: 2000 },
        { sender: 'char', text: 'HE SAW ME! HE HAS A GUN!', delay: 2000, image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800' }
      ],
      soundEffect: 'heartbeat',
      choices: [
        { text: 'RUN!', nextNode: 'run_for_life' }
      ]
    },
    hide_run: {
      messages: [
        { sender: 'char', text: 'I\'m hiding in the bushes. He\'s walking past.', delay: 4000 },
        { sender: 'char', text: 'He didn\'t see me. I\'m past him.', delay: 3000 }
      ],
      choices: [
        { text: 'Get to the forest edge.', nextNode: 'safe_distance' }
      ]
    },
    run_for_life: {
      messages: [
        { sender: 'char', text: 'I\'m running as fast as I can!', delay: 2000 },
        { sender: 'char', text: 'He\'s chasing me! He\'s shooting!', delay: 2000 },
        { sender: 'char', text: 'I\'m almost at the forest edge where the signal is strongest!', delay: 3000 }
      ],
      choices: [
        { text: 'Throw the phone to distract him!', nextNode: 'throw_phone' },
        { text: 'Keep running, don\'t look back!', nextNode: 'keep_running' }
      ],
      timedChoice: { duration: 5000, defaultNextNode: 'keep_running' }
    },
    throw_phone: {
      messages: [
        { sender: 'char', text: 'I threw it into the bushes! He\'s going after it!', delay: 3000 },
        { sender: 'char', text: 'I\'m going to make it!', delay: 2000 }
      ],
      choices: [
        { text: `Good luck, ${charName}.`, nextNode: 'ending_hero' }
      ]
    },
    keep_running: {
      messages: [
        { sender: 'char', text: 'I can\'t breathe... I tripped...', delay: 3000 },
        { sender: 'char', text: 'He\'s standing over me.', delay: 3000 }
      ],
      choices: [
        { text: `${charName}?!`, nextNode: 'ending_tragic' }
      ]
    },
    safe_distance: {
      messages: [
        { sender: 'char', text: 'I made it to the forest. I\'m safe.', delay: 3000 },
        { sender: 'char', text: 'The town is gone. It\'s just ashes.', delay: 3000 }
      ],
      choices: [
        { text: 'You survived. That is what matters.', nextNode: 'final_choice_safe' }
      ]
    },
    final_choice_safe: {
      messages: [
        { sender: 'char', text: 'What do I do now? If I go to the police, the Mayor will kill me.', delay: 3000 }
      ],
      choices: [
        { text: 'Upload the photo to the news anonymously.', nextNode: 'ending_hero' },
        { text: 'Just disappear. Start a new life.', nextNode: 'ending_paradox' }
      ]
    },
    ending_hero: {
      messages: [
        { sender: 'char', text: 'I did it. The news is breaking. The Mayor is being arrested.', delay: 4000, image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=800' },
        { sender: 'char', text: 'You saved my life. And you got justice for Cedar Valley.', delay: 3000 },
        { sender: 'char', text: 'Thank you. Goodbye.', delay: 2000 },
        { sender: 'system', text: 'TIMELINE ALTERED. NEW FUTURE ESTABLISHED. CONNECTION CLOSED.', delay: 3000 }
      ],
      music: 'none'
    },
    ending_tragic: {
      messages: [
        { sender: 'char', text: 'It was nice talking to you... even if it was my last night.', delay: 4000 },
        { sender: 'system', text: 'SIGNAL LOST. CONNECTION TERMINATED.', delay: 2000, image: 'https://images.unsplash.com/photo-1528669826296-dbd6f642fd76?auto=format&fit=crop&q=80&w=800' }
      ],
      music: 'none'
    },
    ending_paradox: {
      messages: [
        { sender: 'char', text: 'You\'re right. I\'m leaving. No one will ever know I survived.', delay: 4000 },
        { sender: 'system', text: 'WARNING: TEMPORAL PARADOX DETECTED.', delay: 2000 },
        { sender: 'system', text: 'TIMELINE COLLAPSING. MEMORY WIPING IN PROGRESS...', delay: 2000 },
        { sender: 'system', text: `Who is ${charName}?`, delay: 3000 }
      ],
      music: 'none'
    }
  };
};
