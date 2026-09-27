import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export default function Pagination({ base, last, nextLabel }: { base: string; last: number; nextLabel: string }) {
  return (
    <section className="pagination">
      <div className="inner">
        <span className="page-numbers current">1</span>
        <Link className="page-numbers" href={`${base}?page=2`}>
          2
        </Link>
        <Link className="page-numbers" href={`${base}?page=3`}>
          3
        </Link>
        <span className="page-numbers dots">…</span>
        <Link className="page-numbers last-page" href={`${base}?page=${last}`}>
          {last}
        </Link>
        <Link className="next page-numbers" href={`${base}?page=2`}>
          <span className="label">{nextLabel}</span>
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
