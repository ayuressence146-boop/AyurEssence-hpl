from typing import List, Dict, Any

class PrakritiCalculationEngine:
    CALCULATION_VERSION = "1.0.0"

    @staticmethod
    def compute_prakriti(option_scores: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Deterministic Prakriti calculation engine.
        Accepts list of option scores: [{"vata": x, "pitta": y, "kapha": z}, ...]
        Returns normalized percentages summing to 100% and dominant dosha.
        """
        v_total = sum(float(s.get("vata", 0.0)) for s in option_scores)
        p_total = sum(float(s.get("pitta", 0.0)) for s in option_scores)
        k_total = sum(float(s.get("kapha", 0.0)) for s in option_scores)

        grand_total = v_total + p_total + k_total

        if grand_total <= 0:
            v_pct = 33.33
            p_pct = 33.33
            k_pct = 33.34
        else:
            v_pct = round((v_total / grand_total) * 100.0, 2)
            p_pct = round((p_total / grand_total) * 100.0, 2)
            k_pct = round(100.0 - (v_pct + p_pct), 2)

        # Determine dominant Dosha
        doshas = [("Vata", v_pct), ("Pitta", p_pct), ("Kapha", k_pct)]
        doshas.sort(key=lambda item: item[1], reverse=True)

        top_d, top_val = doshas[0]
        sec_d, sec_val = doshas[1]
        thr_d, thr_val = doshas[2]

        if (top_val - sec_val) <= 3.0 and (sec_val - thr_val) <= 3.0:
            dominant = "Tridoshic"
        elif (top_val - sec_val) <= 5.0:
            # Dual dosha combination e.g. Vata-Pitta
            dominant = f"{top_d}-{sec_d}"
        else:
            dominant = top_d

        return {
            "vata_percentage": v_pct,
            "pitta_percentage": p_pct,
            "kapha_percentage": k_pct,
            "dominant_dosha": dominant,
            "calculation_version": PrakritiCalculationEngine.CALCULATION_VERSION
        }
