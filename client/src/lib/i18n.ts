import { createContext, useContext } from 'react';

export type Language = 'de' | 'en';

export const translations = {
  de: {
    nav: {
      home: 'Hauptmenü',
      diceGame: 'Würfelspiel',
      truthOrDare: 'Wahrheit oder Pflicht',
      storyGenerator: 'Story Generator',
      impressum: 'Impressum'
    },
    home: {
      title: 'Trinkspiele',
      diceGame: {
        title: 'Würfelspiel',
        description: 'Würfle und folge den Regeln'
      },
      truthOrDare: {
        title: 'Wahrheit oder Pflicht',
        description: 'Wähle weise zwischen Wahrheit und Pflicht'
      },
      storyGenerator: {
        title: 'Story Generator',
        description: 'Erstelle gemeinsam eine Geschichte'
      }
    },
    impressum: {
      title: 'Impressum',
      contact: 'Kontakt'
    },
    diceGame: {
      title: 'Würfelspiel',
      dice: 'Würfel',
      sum: 'Summe',
      roll: 'Würfeln',
      rolling: 'Würfeln...'
    },
    truthOrDare: {
      title: 'Wahrheit oder Pflicht',
      playerCount: 'Wie viele Spieler?',
      players: 'Spieler',
      addPlayer: 'Spieler hinzufügen',
      playerName: 'Spielername',
      add: 'Hinzufügen',
      turn: 'ist dran',
      nextPlayer: 'Nächster Spieler',
      truth: 'Wahrheit',
      dare: 'Pflicht',
      complete: 'Aufgabe erledigt',
      skip: 'Überspringen',
      points: 'Punkte',
      currentPoints: 'Aktuelle Punkte',
      mode: 'Modus',
      kids: 'Kinder',
      normal: 'Normal',
      spicy: 'Spicy'
    }
  },
  en: {
    nav: {
      home: 'Main Menu',
      diceGame: 'Dice Game',
      truthOrDare: 'Truth or Dare',
      storyGenerator: 'Story Generator',
      impressum: 'Legal Notice'
    },
    home: {
      title: 'Drinking Games',
      diceGame: {
        title: 'Dice Game',
        description: 'Roll the dice and follow the rules'
      },
      truthOrDare: {
        title: 'Truth or Dare',
        description: 'Choose wisely between truth and dare'
      },
      storyGenerator: {
        title: 'Story Generator',
        description: 'Create a story together'
      }
    },
    impressum: {
      title: 'Legal Notice',
      contact: 'Contact'
    },
    diceGame: {
      title: 'Dice Game',
      dice: 'Dice',
      sum: 'Sum',
      roll: 'Roll',
      rolling: 'Rolling...'
    },
    truthOrDare: {
      title: 'Truth or Dare',
      playerCount: 'How many players?',
      players: 'Players',
      addPlayer: 'Add Player',
      playerName: 'Player name',
      add: 'Add',
      turn: "'s turn",
      nextPlayer: 'Next Player',
      truth: 'Truth',
      dare: 'Dare',
      complete: 'Challenge completed',
      skip: 'Skip challenge',
      points: 'points',
      currentPoints: 'Current Points',
      mode: 'Mode',
      kids: 'Kids',
      normal: 'Normal',
      spicy: 'Spicy'
    }
  }
};

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: 'de',
  setLanguage: () => {},
});

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  return translations[language];
};