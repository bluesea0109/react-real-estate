import React, { useState } from 'react';
import { DropdownCard } from '../../components/Base';

export default function EditorTab() {
  const [openCard, setOpenCard] = useState('');
  return (
    <>
      <DropdownCard
        title="Brand Color"
        iconName="eye dropper"
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div>color picker</div>
      </DropdownCard>
      <DropdownCard title="Photos" iconName="picture" openCard={openCard} setOpenCard={setOpenCard}>
        <div>Photos</div>
      </DropdownCard>
      <DropdownCard
        title="Display Agent"
        iconName="user outline"
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div>Display Agent</div>
      </DropdownCard>
    </>
  );
}
