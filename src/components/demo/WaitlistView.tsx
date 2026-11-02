import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Check, 
  Sparkles,
  ArrowRight,
  Share2
} from 'lucide-react';
import { useOrderStore, WaitEntry } from '../../store/orders';
import { DEMO_SPEED, RESTAURANT_CONFIG } from '../../config/restaurant';

interface WaitlistViewProps {
  isPanel?: boolean;
  isSelfJoin?: boolean;
}

export const WaitlistView: React.FC<WaitlistViewProps> = ({
  isPanel = false,
  isSelfJoin = false
}) => {
  const store = useOrderStore();
  const [nameInput, setNameInput] = useState('');
  const [partyInput, setPartyInput] = useState<number>(2);
  const [phoneInput, setPhoneInput] = useState('');
  const [myTokenId, setMyTokenId] = useState<string | null>(() => {
    return sessionStorage.getItem('purvarang_my_wait_token');
  });

  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute wait time in kitchen minutes using DEMO_SPEED (3s = 1min)
  const getWaitMins = (createdAt: number) => {
    const elapsedSec = Math.floor((currentTime - createdAt) / 1000);
    return Math.max(0, Math.floor(elapsedSec / DEMO_SPEED));
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const tokenId = store.addWait({
      name: nameInput.trim(),
      party: partyInput,
      phone: phoneInput.trim() || undefined
    });

    if (isSelfJoin) {
      setMyTokenId(tokenId);
      sessionStorage.setItem('purvarang_my_wait_token', tokenId);
    }

    setNameInput('');
    setPhoneInput('');
    setPartyInput(2);
  };

  const handleTableReady = (entry: WaitEntry) => {
    store.callWait(entry.id);

    // If phone number exists, open prefilled WhatsApp message
    if (entry.phone) {
      const cleanPhone = entry.phone.replace(/\D/g, '');
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const text = encodeURIComponent(
        `Namaste ${entry.name}! Your table at Purvarang Family Restaurant is ready (Token: ${entry.id}, Party of ${entry.party}). Please step inside to be seated.`
      );
      window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
    }
  };

  // Self Join Queue Position
  const myQueueEntry = useMemo(() => {
    if (!myTokenId) return null;
    return store.waitlist.find(e => e.id === myTokenId);
  }, [store.waitlist, myTokenId]);

  const myPosition = useMemo(() => {
    if (!myTokenId) return 0;
    const index = store.waitlist.findIndex(e => e.id === myTokenId);
    return index >= 0 ? index + 1 : 0;
  }, [store.waitlist, myTokenId]);

  // If in guest self-join mode and guest has joined:
  if (isSelfJoin && myQueueEntry) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white border border-wheat rounded-[16px] shadow-soft text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F2F8F4] border border-[#C4DFC9] flex items-center justify-center text-palak mx-auto">
          <Users className="w-8 h-8 stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[14px] text-palak font-bold uppercase tracking-wider block">
            Queue Confirmed
          </span>
          <h2 className="font-serif text-3xl font-bold text-espresso">
            Token {myQueueEntry.id}
          </h2>
          <p className="text-[15px] text-clay">
            Guest: <strong>{myQueueEntry.name}</strong> • Party of <strong>{myQueueEntry.party}</strong>
          </p>
        </div>

        <div className="p-4 bg-paper rounded-[12px] border border-wheat space-y-2">
          <div className="text-[13px] text-clay uppercase font-bold tracking-wider">
            Your Position in Line
          </div>
          <div className="font-serif text-4xl font-bold text-mirchi">
            #{myPosition}
          </div>
          <p className="text-[13px] text-clay">
            {myQueueEntry.called ? (
              <span className="text-palak font-bold">
                Your table is ready! Please proceed to the host desk.
              </span>
            ) : (
              <span>Estimated wait: ~{myPosition * 5 + 5} mins</span>
            )}
          </p>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem('purvarang_my_wait_token');
            setMyTokenId(null);
          }}
          className="text-[13px] text-clay hover:text-mirchi font-medium underline"
        >
          Leave queue / Join another
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-cream text-espresso ${isPanel ? 'h-full rounded-[16px] overflow-hidden border border-wheat' : 'w-full'}`}>
      
      {/* Header */}
      <div className="bg-white border-b border-wheat p-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[8px] bg-paper flex items-center justify-center text-espresso">
            <Users className="w-5 h-5 text-kesar stroke-[2]" />
          </div>
          <div>
            <h2 className="font-serif text-[18px] font-bold text-espresso leading-tight">
              Walk-in Waiting List
            </h2>
            <p className="text-[13px] text-clay">
              Host Desk • Table Turn Tracking
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-paper border border-wheat rounded-full text-[13px] font-bold text-espresso">
          {store.waitlist.length} Waiting
        </span>
      </div>

      {/* Add Guest Form */}
      <form onSubmit={handleAddGuest} className="p-3.5 bg-paper/60 border-b border-wheat shrink-0 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Guest name *"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            className="text-[14px] px-3 py-2 bg-white border border-wheat rounded-[8px] text-espresso focus:outline-none focus:ring-1 focus:ring-kesar"
          />

          <div className="flex items-center bg-white border border-wheat rounded-[8px] px-3 py-1">
            <span className="text-[13px] text-clay mr-2 shrink-0">Party:</span>
            <select
              value={partyInput}
              onChange={(e) => setPartyInput(Number(e.target.value))}
              className="w-full bg-transparent text-[14px] font-bold text-espresso focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <input
            type="tel"
            placeholder="Phone (WhatsApp alerts)"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="text-[14px] px-3 py-2 bg-white border border-wheat rounded-[8px] text-espresso focus:outline-none focus:ring-1 focus:ring-kesar"
          />
        </div>

        <button
          type="submit"
          className="w-full min-h-[44px] bg-palak hover:bg-[#163826] text-white font-bold text-[15px] rounded-[8px] flex items-center justify-center gap-2 transition-colors active:scale-98 shadow-soft"
        >
          <UserPlus className="w-4 h-4 stroke-[2]" />
          <span>Add to Waitlist</span>
        </button>
      </form>

      {/* Waiting List Items */}
      <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto">
        {store.waitlist.length === 0 ? (
          <div className="text-center py-12 text-clay text-[14px]">
            No guests currently waiting in the lobby
          </div>
        ) : (
          store.waitlist.map(entry => {
            const waitMins = getWaitMins(entry.createdAt);
            return (
              <div
                key={entry.id}
                className="p-3 bg-white border border-wheat rounded-[12px] shadow-soft flex flex-col gap-2.5 hover:border-kesar transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-[22px] font-bold text-mirchi min-w-10">
                      {entry.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-[16px] text-espresso leading-snug">
                        {entry.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[13px] text-clay mt-0.5">
                        <span className="font-medium">{entry.party} Guests</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{waitMins}m wait</span>
                        </span>
                        {entry.phone && (
                          <>
                            <span>•</span>
                            <span className="text-[12px] font-mono">{entry.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {entry.called && (
                    <span className="px-2.5 py-0.5 bg-palak/10 text-palak border border-palak/30 rounded-full text-[12px] font-bold uppercase shrink-0">
                      Called
                    </span>
                  )}
                </div>

                {/* Actions: Table Ready, Seated, No Show */}
                <div className="flex items-center gap-2 pt-1 border-t border-wheat/60">
                  <button
                    onClick={() => handleTableReady(entry)}
                    className="flex-1 min-h-[38px] bg-paper hover:bg-wheat/70 border border-wheat text-espresso font-bold text-[13px] rounded-[6px] flex items-center justify-center gap-1.5 transition-colors"
                    title={entry.phone ? 'Notify on WhatsApp & mark called' : 'Mark called'}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-palak stroke-[1.75]" />
                    <span>Table Ready</span>
                  </button>

                  <button
                    onClick={() => store.seatWait(entry.id)}
                    className="flex-1 min-h-[38px] bg-palak hover:bg-[#163826] text-white font-bold text-[13px] rounded-[6px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Seated</span>
                  </button>

                  <button
                    onClick={() => store.noShowWait(entry.id)}
                    className="px-3 min-h-[38px] bg-white hover:bg-red-50 text-clay hover:text-mirchi border border-wheat rounded-[6px] text-[13px] font-medium transition-colors"
                    title="No show / Remove"
                  >
                    No Show
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
