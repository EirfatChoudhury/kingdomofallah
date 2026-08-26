// src/app/page.js
import { HomePageView } from '@/components/HomePageView';
import { MemberStrip } from '@/components/MemberStrip';

export default function HomePage() {
  return <HomePageView memberStripSlot={<MemberStrip />} />;
}