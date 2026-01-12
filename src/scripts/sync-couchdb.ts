import 'dotenv/config';
import { exit } from 'node:process';

const { SOURCE_URL, SOURCE_USER, SOURCE_PASSWORD, TARGET_URL, TARGET_USER, TARGET_PASSWORD } =
  process.env;

if (
  !SOURCE_URL ||
  !SOURCE_USER ||
  !SOURCE_PASSWORD ||
  !TARGET_URL ||
  !TARGET_USER ||
  !TARGET_PASSWORD
) {
  console.log('Malformed .env');
  exit(0);
}

async function main() {
  const dbs = await (
    await fetch(`${SOURCE_URL}/_all_dbs`, {
      headers: {
        Authorization: `Basic ${btoa(SOURCE_USER + ':' + SOURCE_PASSWORD)}`,
      },
      credentials: 'include',
    })
  ).json();

  for (const db of dbs) {
    if (db.startsWith('_')) {
      continue;
    }

    let response = await (
      await fetch(`${TARGET_URL}/${db}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${btoa(TARGET_USER + ':' + TARGET_PASSWORD)}`,
        },
        credentials: 'include',
      })
    ).json();

    if (response.error && response.error !== 'not_found') {
      throw response;
    }

    console.dir(response);

    response = await (
      await fetch(`${TARGET_URL}/${db}`, {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${btoa(TARGET_USER + ':' + TARGET_PASSWORD)}`,
        },
        credentials: 'include',
      })
    ).json();

    if (response.error && response.error !== 'file_exists') {
      throw response;
    } else if (response.error && response.error === 'file_exists') {
      console.log(`${db} already exists`);
    } else {
      console.log(`created ${db}`);
    }

    const sourceWithCreds = SOURCE_URL!.replaceAll(
      'http://',
      `http://${SOURCE_USER}:${SOURCE_PASSWORD}@`,
    );

    const targetWithCreds = TARGET_URL!.replaceAll(
      'https://',
      `https://${TARGET_USER}:${TARGET_PASSWORD}@`,
    );

    response = await (
      await fetch(`${SOURCE_URL}/_replicator`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(SOURCE_USER + ':' + SOURCE_PASSWORD)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: `${sourceWithCreds}/${db}`,
          target: `${targetWithCreds}/${db}`,
          create_target: true,
          continuous: false,
        }),
        credentials: 'include',
      })
    ).json();

    if (response.error) {
      throw response;
    }

    console.dir(response);
  }
}

main().catch((e) => console.dir(e));
