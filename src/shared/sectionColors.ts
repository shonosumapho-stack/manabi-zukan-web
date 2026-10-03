/** Android res/values/colors.xml の btn_* */
export const SECTION_BUTTON_COLORS: Record<string, string> = {
  bg_btn_animal: '#F97316',
  bg_btn_insect: '#16A34A',
  bg_btn_word: '#0EA5E9',
  bg_btn_event: '#DB2777',
  bg_btn_plant: '#65A30D',
  bg_btn_weather: '#38BDF8',
  bg_btn_dino: '#B45309',
  bg_btn_space: '#4338CA',
  bg_btn_music: '#E11D48',
  bg_btn_body: '#F43F5E',
  bg_btn_vehicle: '#2563EB',
  bg_btn_rock: '#78716C',
  bg_btn_food: '#EA580C',
  bg_btn_tool: '#7C3AED',
  bg_btn_quiz: '#8B5CF6',
  bg_btn_all: '#0D9488',
};

export function sectionButtonColor(buttonBg: string): string {
  return SECTION_BUTTON_COLORS[buttonBg] ?? '#0D9488';
}
