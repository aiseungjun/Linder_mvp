// src/components/SignupFeedbackCard.tsx
import React from "react";

const SignupFeedbackCard: React.FC = () => {
  return (
    <section
      className="mx-auto max-w-xl px-10
                 mt-16 md:mt-16 lg:mt-24"  // ← 여기만 바뀜 (헤더 높이에 맞춰 조절)
    >
      <div className="rounded-2xl border border-zinc-200/70 bg-white/70 shadow-lg backdrop-blur p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <i className="ri-mail-add-line text-2xl" />
          <div>
            <h2 className="text-xl font-semibold tracking-tight">알림 신청 & 피드백</h2>
            <p className="mt-1 text-sm text-zinc-600">
              이메일을 남기면 런칭 소식을 보내드리고, 피드백을 서비스에 반영할게요.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">이메일</span>
            <input
              id="submit-email"
              type="email"
              placeholder="example@domain.com"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none
                         focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 transition"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">후기 / 조언</span>
            <textarea
              id="submit-advice"
              rows={5}
              placeholder="서비스에 대한 조언을 남겨주세요"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none
                         focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 transition resize-y"
            />
          </label>

          <button
            id="submit"
            type="button"
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white shadow
                       hover:bg-zinc-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900/20 transition">
            지금 제출!
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignupFeedbackCard;
