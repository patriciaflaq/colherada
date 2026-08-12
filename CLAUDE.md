# Colherada

App de receitas em arquivo único. `index.html` contém HTML, CSS e todo o JS, incluindo
o array `SEED_RECIPES`. PWA servido pelo GitHub Pages a partir de `main`, publicado em
colherada.com.

## Regras permanentes de conteúdo

Valem para toda receita, sem exceção, tanto em receitas novas quanto em edições.

- **Sem alho.** Nenhuma receita leva alho. Alho-poró é permitido.
- **Sistema métrico sempre.** Gramas e mililitros para quantidades, °C para temperatura.
  Nunca oz, lb ou °F, nem entre parênteses como conversão.
- **Adoçantes:** apenas alulose, monk fruit e stevia. Nenhum outro.
- **Português brasileiro** nos campos de receita (`name`, `notes`, `ingredients`, `steps`).
  Os campos `_en` são a tradução para inglês.

## Fluxo de receita nova

**Comentar antes de inserir. Só inserir depois de aprovação explícita.**

Ao receber uma receita nova, primeiro revisar e relatar, sem tocar no arquivo:

1. **Macros que não fecham** — proteína, carboidrato e gordura conferidos contra as
   calorias declaradas, e contra as quantidades reais dos ingredientes.
2. **Inconsistências entre ingredientes e preparo** — item listado que nunca é usado nos
   passos, ou passo que usa algo que não está na lista.
3. **Rendimento não declarado** — quantas porções, e se os macros são por porção ou do total.
4. **Alho a remover** — apontar onde aparece e o que fazer no lugar.

Só depois do OK, inserir. A inserção tem quatro partes, todas obrigatórias:

1. Inserir o objeto da receita em `SEED_RECIPES` **imediatamente antes da linha `{id:9,`**.
2. Adicionar a entrada correspondente em `NAMES`, com nome PT e EN.
3. Subir `SEED_VERSION` em 1.
4. Subir o `CACHE_NAME` do `sw.js` em 1.

Sem o passo 3 o merge versionado não roda e a receita não aparece para quem já tem dados
salvos. Sem o passo 4 o service worker continua servindo o HTML antigo do cache.

## Próximos valores livres

| | Próximo |
|---|---|
| id de receita | **96** |
| `SEED_VERSION` | **38** |
| `CACHE_NAME` | **v36** |

Atualizar esta tabela junto com cada receita inserida.

## SEED_VERSION e CACHE_NAME são independentes

São dois contadores separados, com propósitos diferentes: `SEED_VERSION` controla o merge
de receitas novas no `localStorage` de quem já usa o app, `CACHE_NAME` invalida o cache do
service worker. Cada um sobe pelos seus próprios motivos e eles **não devem ser alinhados**.
Hoje estão em 37 e v35. Divergirem é o esperado, não é bug — não "corrigir".

## Validação

**Não há runtime JS nesta máquina** — `node`, `deno` e `bun` não estão instalados, então
`node --check` não é uma opção. Para validar qualquer alteração no JS, servir por HTTP e
ler o console do browser:

```bash
python3 -m http.server 8765
```

Depois abrir `http://localhost:8765/index.html` e conferir que o console está limpo e que
o grid renderiza a contagem esperada de receitas.

Abrir o `index.html` direto por `file://` **não serve como teste**: em alguns browsers o
`localStorage` lança `SecurityError` nessa origem, o script aborta na primeira linha que o
acessa e a lista aparece vazia. É falha do ambiente, não do código.
