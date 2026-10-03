export type TemplateCategory = 
  | 'birthday'
  | 'proposal'
  | 'anniversary'
  | 'apology'
  | 'friendship';

export type InteractiveType = 
  | 'balloon_pop'
  | 'candle_cake'
  | 'unrejectable_proposal'
  | 'photo_puzzle'
  | 'scratch_card'
  | 'envelope_seal';

export type CompanionType = 'teddy' | 'bunny' | 'kitty' | 'puppy';

export type CompanionAccessory = 
  | 'none' 
  | 'ribbon' 
  | 'party_hat' 
  | 'flower' 
  | 'crown' 
  | 'heart_glasses';

export type CompanionEmotion = 
  | 'idle' 
  | 'greeting' 
  | 'cheering' 
  | 'curious' 
  | 'loving' 
  | 'surprised' 
  | 'giggle';

export interface CompanionConfig {
  enabled: boolean;
  type: CompanionType;
  name: string;
  accessory: CompanionAccessory;
  furColor?: string;
  dialogueBubbleEnabled: boolean;
  startAction?: 'wave' | 'cheer' | 'heart';
}

export interface CardTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  categoryLabel: string;
  themeColor: string;
  bgGradient: string;
  description: string;
  interactiveType: InteractiveType;
  defaultHeadline: string;
  defaultMessage: string;
  defaultProposalQuestion?: string;
  defaultPhotoUrl?: string;
  iconName: string;
  defaultCompanion?: CompanionConfig;
}

export interface CardData {
  id: string;
  templateId: string;
  category: TemplateCategory;
  recipientName: string;
  senderName: string;
  headline: string;
  message: string;
  interactiveType: InteractiveType;
  photoUrl?: string;
  themeColor: string;
  bgGradient: string;
  proposalQuestion?: string;
  secretClue?: string;
  puzzleGridSize?: number;
  bgMusicEnabled: boolean;
  musicTrack: 'romantic_melody' | 'birthday_waltz' | 'gentle_chime' | 'none';
  companionConfig?: CompanionConfig;
  createdAt: string;
  viewsCount?: number;
}

