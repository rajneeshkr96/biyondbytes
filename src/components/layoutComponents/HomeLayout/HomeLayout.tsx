import React from 'react';
import Footer from '@/components/Footer/Footer';
import { data } from '@/components/Footer/data';
import MediaQuery from '../MediaQuery';
import FooterNav from '../FooterNav';
import PushNotification from '@/components/post/pushNotification/PushNotification';


export default function HomeLayout({ children }: { children: React.ReactNode }) {


  return (
    <div>
      
      {children}
      <Footer data={data} />
      <MediaQuery maxSize={720}>
        <FooterNav />
      </MediaQuery>
      <PushNotification/>
    </div>
  );
}
