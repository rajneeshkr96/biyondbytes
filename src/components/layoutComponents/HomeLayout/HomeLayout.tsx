import React from 'react';
import MediaQuery from '../MediaQuery';
import FooterNav from '../FooterNav';
import BackToTop from '../BackToTop';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}

      <BackToTop />
      <MediaQuery maxSize={720}>
        <FooterNav />
      </MediaQuery>
    </div>
  );
}
